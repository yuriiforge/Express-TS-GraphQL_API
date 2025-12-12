import { PostService } from '../../src/modules/post/post.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { CreatePostInput } from '../../src/modules/post/dtos/create-post-input';
import { UpdatePostInput } from '../../src/modules/post/dtos/update-post-input';

describe('PostService', () => {
  let service: PostService;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(() => {
    prisma = mockDeep<PrismaClient>();
    service = new PostService(prisma);
  });

  // -------------------------
  // getPosts()
  // -------------------------
  describe('getPosts', () => {
    it('returns posts filtered by query', async () => {
      prisma.post.findMany.mockResolvedValue([
        { id: 1, title: 'Hello', body: 'world', published: true, authorId: 1 },
      ]);

      const result = await service.getPosts({
        query: 'hello',
        skip: 0,
        take: 10,
      });

      expect(prisma.post.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { title: { contains: 'hello', mode: 'insensitive' } },
            { body: { contains: 'hello', mode: 'insensitive' } },
          ],
          published: true,
        },
        skip: 0,
        take: 10,
      });

      expect(result).toEqual([
        { id: 1, title: 'Hello', body: 'world', published: true, authorId: 1 },
      ]);
    });

    it('returns posts without query (only published)', async () => {
      prisma.post.findMany.mockResolvedValue([
        { id: 1, title: 'Post', body: 'Body', published: true, authorId: 1 },
      ]);

      const result = await service.getPosts({
        query: undefined,
        skip: undefined,
        take: undefined,
      });

      expect(prisma.post.findMany).toHaveBeenCalledWith({
        where: { published: true },
        skip: undefined,
        take: undefined,
      });

      expect(result).toHaveLength(1);
    });
  });

  // -------------------------
  // getPostById()
  // -------------------------
  describe('getPostById', () => {
    it('returns post by id', async () => {
      prisma.post.findUniqueOrThrow.mockResolvedValue({
        id: 1,
        title: 'Test',
        body: 'Body',
        published: true,
        authorId: 1,
      });

      const result = await service.getPostById(1);

      expect(prisma.post.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: 1 },
      });

      expect(result.id).toBe(1);
    });
  });

  // -------------------------
  // createPost()
  // -------------------------
  describe('createPost', () => {
    it('creates a new post', async () => {
      const data: CreatePostInput = {
        title: 'New post',
        body: 'Text',
        published: true,
        authorId: 5,
      };

      prisma.post.create.mockResolvedValue({
        id: 10,
        title: data.title,
        body: data.body,
        published: data.published,
        authorId: data.authorId,
      });

      const result = await service.createPost(data);

      expect(prisma.post.create).toHaveBeenCalledWith({
        data: {
          title: 'New post',
          body: 'Text',
          published: true,
          author: { connect: { id: 5 } },
        },
      });

      expect(result.id).toBe(10);
    });
  });

  // -------------------------
  // updatePost()
  // -------------------------
  describe('updatePost', () => {
    it('updates a post', async () => {
      const data: UpdatePostInput = {
        title: 'Updated',
      };

      prisma.post.update.mockResolvedValue({
        id: 1,
        title: 'Updated',
        body: 'Old',
        published: true,
        authorId: 1,
      });

      const result = await service.updatePost(1, data);

      expect(prisma.post.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data,
      });

      expect(result.title).toBe('Updated');
    });
  });

  // -------------------------
  // deletePost()
  // -------------------------
  describe('deletePost', () => {
    it('deletes a post', async () => {
      prisma.post.delete.mockResolvedValue({
        id: 1,
        title: 'Deleted',
        body: 'x',
        published: true,
        authorId: 1,
      });

      const result = await service.deletePost(1);

      expect(prisma.post.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });

      expect(result.id).toBe(1);
    });
  });
});
