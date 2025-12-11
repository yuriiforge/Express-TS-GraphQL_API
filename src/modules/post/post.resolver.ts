import { Post } from '@prisma/client';
import { Context } from '../../types/Context';
import { PostService } from './post.service';
import prisma from '../../prisma';

const postService = new PostService(prisma);

export const postResolvers = {
  Query: {
    posts: async (
      _parent: unknown,
      args: { query?: string; skip?: number; first?: number },
      ctx: Context
    ): Promise<Post[]> => {
      return postService.getPosts({
        query: args.query,
        skip: args.skip,
        take: args.first,
      });
    },

    post: async (
      _parent: unknown,
      args: { id: number },
      ctx: Context
    ): Promise<Post> => {
      const post = await postService.getPostById(args.id);
      if (!post) {
        throw new Error('Post not found');
      }
      return post;
    },
  },

  Mutation: {
    createPost: async (
      _parent: unknown,
      args: { data: { title: string; body: string; published: boolean } },
      ctx: Context
    ): Promise<Post> => {
      const userId = ctx.userId;
      if (!userId) {
        throw new Error('Unauthorized');
      }
      return postService.createPost({
        ...args.data,
        authorId: parseInt(userId),
      });
    },

    updatePost: async (
      _parent: unknown,
      args: {
        id: number;
        data: Partial<{ title: string; body: string; published: boolean }>;
      },
      ctx: Context
    ): Promise<Post> => {
      const post = await postService.updatePost(args.id, args.data);
      if (!post) {
        throw new Error('Post not found');
      }
      return post;
    },

    deletePost: async (
      _parent: unknown,
      args: { id: number },
      ctx: Context
    ): Promise<Post> => {
      const post = await postService.deletePost(args.id);
      if (!post) {
        throw new Error('Post not found');
      }
      return post;
    },
  },
};
