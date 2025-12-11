import { Comment } from '@prisma/client';
import { Context } from '../../types/Context';
import { CommentService } from './comment.service';
import prisma from '../../prisma';

const commentService = new CommentService(prisma);

export const commentResolvers = {
  Query: {
    comments: async (
      _parent: unknown,
      args: { skip?: number; take?: number },
      ctx: Context
    ): Promise<Comment[]> => {
      return commentService.getComments(args.skip, args.take);
    },
  },

  Mutation: {
    createComment: async (
      _parent: unknown,
      args: { data: { text: string; authorId: number; postId: number } },
      ctx: Context
    ): Promise<Comment> => {
      return commentService.createComment(args.data);
    },

    updateComment: async (
      _parent: unknown,
      args: { id: number; data: Partial<{ text: string }> },
      ctx: Context
    ): Promise<Comment> => {
      const comment = await commentService.updateComment(args.id, args.data);
      if (!comment) {
        throw new Error('Comment not found');
      }
      return comment;
    },

    deleteComment: async (
      _parent: unknown,
      args: { id: number },
      ctx: Context
    ): Promise<Comment> => {
      const comment = await commentService.deleteComment(args.id);
      if (!comment) {
        throw new Error('Comment not found');
      }
      return comment;
    },
  },
};
