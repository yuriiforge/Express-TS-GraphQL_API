import {
  __setCommentService,
  commentResolvers,
} from '../../src/modules/comment/comment.resolver';
import { CommentService } from '../../src/modules/comment/comment.service';
import { Comment } from '@prisma/client';

const createMockCommentService = () => ({
  getComments: jest.fn(),
  createComment: jest.fn(),
  updateComment: jest.fn(),
  deleteComment: jest.fn(),
});

let mockService: ReturnType<typeof createMockCommentService>;

beforeEach(() => {
  mockService = createMockCommentService();
  __setCommentService(mockService as unknown as CommentService);
});

describe('commentResolvers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // -------------------------
  // Query.comments
  // -------------------------
  describe('Query.comments', () => {
    it('returns a list of comments', async () => {
      const comments: Comment[] = [
        { id: 1, text: 'Hello', postId: 1, authorId: 1 },
        { id: 2, text: 'World', postId: 1, authorId: 2 },
      ];
      mockService.getComments.mockResolvedValue(comments);

      const result = await commentResolvers.Query.comments(
        null,
        { skip: 0, take: 10 },
        {} as any
      );

      expect(mockService.getComments).toHaveBeenCalledWith(0, 10);
      expect(result).toHaveLength(2);
    });
  });

  // -------------------------
  // Mutation.createComment
  // -------------------------
  describe('Mutation.createComment', () => {
    it('creates a comment', async () => {
      const data = { text: 'New Comment', postId: 1, authorId: 1 };
      const createdComment: Comment = { id: 1, ...data };

      mockService.createComment.mockResolvedValue(createdComment);

      const result = await commentResolvers.Mutation.createComment(
        null,
        { data },
        {} as any
      );

      expect(mockService.createComment).toHaveBeenCalledWith(data);
      expect(result.id).toBe(1);
      expect(result.text).toBe('New Comment');
    });
  });

  // -------------------------
  // Mutation.updateComment
  // -------------------------
  describe('Mutation.updateComment', () => {
    it('updates a comment', async () => {
      const updatedData = { text: 'Updated Comment' };
      const updatedComment: Comment = {
        id: 1,
        text: 'Updated Comment',
        postId: 1,
        authorId: 1,
      };

      mockService.updateComment.mockResolvedValue(updatedComment);

      const result = await commentResolvers.Mutation.updateComment(
        null,
        { id: 1, data: updatedData },
        {} as any
      );

      expect(mockService.updateComment).toHaveBeenCalledWith(1, updatedData);
      expect(result.text).toBe('Updated Comment');
    });

    it('throws error if comment not found', async () => {
      mockService.updateComment.mockResolvedValue(null as any);

      await expect(
        commentResolvers.Mutation.updateComment(
          null,
          { id: 99, data: { text: 'x' } },
          {} as any
        )
      ).rejects.toThrow('Comment not found');
    });
  });

  // -------------------------
  // Mutation.deleteComment
  // -------------------------
  describe('Mutation.deleteComment', () => {
    it('deletes a comment', async () => {
      const deletedComment: Comment = {
        id: 1,
        text: 'Bye',
        postId: 1,
        authorId: 1,
      };

      mockService.deleteComment.mockResolvedValue(deletedComment);

      const result = await commentResolvers.Mutation.deleteComment(
        null,
        { id: 1 },
        {} as any
      );

      expect(mockService.deleteComment).toHaveBeenCalledWith(1);
      expect(result.id).toBe(1);
    });

    it('throws error if comment not found', async () => {
      mockService.deleteComment.mockResolvedValue(null as any);

      await expect(
        commentResolvers.Mutation.deleteComment(null, { id: 99 }, {} as any)
      ).rejects.toThrow('Comment not found');
    });
  });
});
