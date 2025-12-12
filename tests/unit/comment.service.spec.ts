import { CommentService } from '../../src/modules/comment/comment.service';
import { PrismaClient, Comment } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

describe('CommentService', () => {
  let service: CommentService;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(() => {
    prisma = mockDeep<PrismaClient>();
    service = new CommentService(prisma);
  });

  // -------------------------
  // createComment
  // -------------------------
  describe('createComment', () => {
    it('should create a comment', async () => {
      const data = { text: 'Hello', postId: 1, authorId: 2 };
      const createdComment: Comment = { id: 1, ...data };

      prisma.comment.create.mockResolvedValue(createdComment);

      const result = await service.createComment(data);

      expect(prisma.comment.create).toHaveBeenCalledWith({ data });
      expect(result).toEqual(createdComment);
    });
  });

  // -------------------------
  // updateComment
  // -------------------------
  describe('updateComment', () => {
    it('should update a comment', async () => {
      const data = { text: 'Updated' };
      const updatedComment: Comment = {
        id: 1,
        text: 'Updated',
        postId: 1,
        authorId: 2,
      };

      prisma.comment.update.mockResolvedValue(updatedComment);

      const result = await service.updateComment(1, data);

      expect(prisma.comment.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data,
      });
      expect(result.text).toBe('Updated');
    });
  });

  // -------------------------
  // deleteComment
  // -------------------------
  describe('deleteComment', () => {
    it('should delete a comment', async () => {
      const deletedComment: Comment = {
        id: 1,
        text: 'Bye',
        postId: 1,
        authorId: 2,
      };

      prisma.comment.delete.mockResolvedValue(deletedComment);

      const result = await service.deleteComment(1);

      expect(prisma.comment.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result.id).toBe(1);
    });
  });

  // -------------------------
  // getComments
  // -------------------------
  describe('getComments', () => {
    it('should return list of comments', async () => {
      const comments: Comment[] = [
        { id: 1, text: 'Hello', postId: 1, authorId: 2 },
        { id: 2, text: 'World', postId: 1, authorId: 3 },
      ];

      prisma.comment.findMany.mockResolvedValue(comments);

      const result = await service.getComments(0, 10);

      expect(prisma.comment.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
      });
      expect(result).toHaveLength(2);
    });
  });

  // -------------------------
  // getCommentById
  // -------------------------
  describe('getCommentById', () => {
    it('should return a single comment by id', async () => {
      const comment: Comment = { id: 1, text: 'Test', postId: 1, authorId: 2 };

      prisma.comment.findUniqueOrThrow.mockResolvedValue(comment);

      const result = await service.getCommentById(1);

      expect(prisma.comment.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result.id).toBe(1);
    });
  });
});
