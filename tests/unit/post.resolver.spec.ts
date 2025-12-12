import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import {
  __setPostService,
  postResolvers,
} from '../../src/modules/post/post.resolver';
import { PostService } from '../../src/modules/post/post.service';
import { Post } from '@prisma/client';

const createMockPostService = () => ({
  getPosts: jest.fn(),
  getPostById: jest.fn(),
  createPost: jest.fn(),
  updatePost: jest.fn(),
  deletePost: jest.fn(),
});

let mockService: ReturnType<typeof createMockPostService>;

beforeEach(() => {
  mockService = createMockPostService();
  __setPostService(mockService as unknown as PostService);
});

describe('postResolvers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Query.posts', () => {
    it('returns list of posts', async () => {
      mockService.getPosts.mockResolvedValue([
        { id: 1, title: 'Test', body: 'Body', published: true, authorId: 1 },
      ] as Post[]);

      const result = await postResolvers.Query.posts(
        null,
        { query: '', skip: 0, first: 10 },
        {} as any
      );

      expect(mockService.getPosts).toHaveBeenCalledWith({
        query: '',
        skip: 0,
        take: 10,
      });
      expect(result).toHaveLength(1);
    });
  });

  describe('Query.post', () => {
    it('returns a single post', async () => {
      mockService.getPostById.mockResolvedValue({
        id: 1,
        title: 'Test',
        body: 'Body',
        published: true,
        authorId: 1,
      } as Post);

      const result = await postResolvers.Query.post(null, { id: 1 }, {} as any);

      expect(mockService.getPostById).toHaveBeenCalledWith(1);
      expect(result.id).toBe(1);
    });

    it('throws error if post not found', async () => {
      mockService.getPostById.mockImplementation(() => {
        throw new Error('Post not found');
      });

      await expect(
        postResolvers.Query.post(null, { id: 99 }, {} as any)
      ).rejects.toThrow('Post not found');
    });
  });

  describe('Mutation.createPost', () => {
    it('creates a post when authorized', async () => {
      const ctx = { userId: '1' };
      const postData = { title: 'Title', body: 'Body', published: true };
      mockService.createPost.mockResolvedValue({
        id: 1,
        ...postData,
        authorId: 1,
      } as Post);

      const result = await postResolvers.Mutation.createPost(
        null,
        { data: postData },
        ctx as any
      );

      expect(mockService.createPost).toHaveBeenCalledWith({
        ...postData,
        authorId: 1,
      });
      expect(result.id).toBe(1);
    });

    it('throws error if unauthorized', async () => {
      await expect(
        postResolvers.Mutation.createPost(
          null,
          { data: { title: 'x', body: 'y', published: true } },
          {} as any
        )
      ).rejects.toThrow('Unauthorized');
    });
  });

  describe('Mutation.updatePost', () => {
    it('updates a post', async () => {
      const postData = { title: 'Updated' };
      mockService.updatePost.mockResolvedValue({
        id: 1,
        title: 'Updated',
        body: 'Body',
        published: true,
        authorId: 1,
      } as Post);

      const result = await postResolvers.Mutation.updatePost(
        null,
        { id: 1, data: postData },
        {} as any
      );

      expect(mockService.updatePost).toHaveBeenCalledWith(1, postData);
      expect(result.title).toBe('Updated');
    });
  });

  describe('Mutation.deletePost', () => {
    it('deletes a post', async () => {
      mockService.deletePost.mockResolvedValue({
        id: 1,
        title: 'Title',
        body: 'Body',
        published: true,
        authorId: 1,
      } as Post);

      const result = await postResolvers.Mutation.deletePost(
        null,
        { id: 1 },
        {} as any
      );

      expect(mockService.deletePost).toHaveBeenCalledWith(1);
      expect(result.id).toBe(1);
    });
  });
});
