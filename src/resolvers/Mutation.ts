// src/resolvers/Mutation.ts

import { Context } from '../types/Context';
import { Prisma } from '@prisma/client';
import { User, Post, Comment } from '@prisma/client';

interface UserMutationArgs {
  data: Prisma.UserCreateInput | Prisma.UserUpdateInput;
  id: number;
}
interface PostMutationArgs {
  data: {
    title: string;
    body: string;
    published: boolean;
    author: number; // Assuming author ID is passed as number
  };
  id: number;
}
interface CommentMutationArgs {
  data: {
    text: string;
    author: number;
    post: number;
  };
  id: number;
}

const Mutation = {
  // --- USER MUTATIONS ---

  async createUser(
    parent: any,
    args: { data: Prisma.UserCreateInput },
    { prisma }: Context
  ): Promise<User> {
    try {
      return await prisma.user.create({ data: args.data });
    } catch (e: any) {
      if (e.code === 'P2002') {
        throw new Error('Email taken');
      }
      throw e;
    }
  },

  async deleteUser(
    parent: any,
    args: { id: number },
    { prisma }: Context
  ): Promise<User> {
    try {
      return await prisma.user.delete({ where: { id: args.id } });
    } catch (e: any) {
      if (e.code === 'P2025') {
        throw new Error('User not found');
      }
      throw e;
    }
  },

  async updateUser(
    parent: any,
    args: { id: number; data: Prisma.UserUpdateInput },
    { prisma }: Context
  ): Promise<User> {
    try {
      return await prisma.user.update({
        where: { id: args.id },
        data: args.data,
      });
    } catch (e: any) {
      if (e.code === 'P2025') {
        throw new Error('User not found');
      }
      if (e.code === 'P2002') {
        throw new Error('Email taken');
      }
      throw e;
    }
  },

  // --- POST MUTATIONS ---

  async createPost(
    parent: any,
    args: PostMutationArgs,
    { prisma, pubsub }: Context
  ): Promise<Post> {
    try {
      const post = await prisma.post.create({
        data: {
          title: args.data.title,
          body: args.data.body,
          published: args.data.published,
          author: { connect: { id: args.data.author } },
        },
      });

      if (post.published) {
        pubsub.publish('post', { post: { mutation: 'CREATED', data: post } });
      }

      return post;
    } catch (e: any) {
      if (e.code === 'P2003') {
        throw new Error('User not found');
      }
      throw e;
    }
  },

  async deletePost(
    parent: any,
    args: { id: number },
    { prisma, pubsub }: Context
  ): Promise<Post> {
    const postToDelete = await prisma.post.findUnique({
      where: { id: args.id },
      select: { published: true },
    });

    if (!postToDelete) {
      throw new Error('Post not found');
    }

    const post = await prisma.post.delete({ where: { id: args.id } });

    if (postToDelete.published) {
      pubsub.publish('post', { post: { mutation: 'DELETED', data: post } });
    }

    return post;
  },

  async updatePost(
    parent: any,
    args: { id: number; data: Prisma.PostUpdateInput },
    { prisma, pubsub }: Context
  ): Promise<Post> {
    const { id, data } = args;

    const originalPost = await prisma.post.findUnique({ where: { id } });

    if (!originalPost) {
      throw new Error('Post not found');
    }

    const post = await prisma.post.update({ where: { id }, data });

    // Subscription Logic
    const wasPublished = originalPost.published;
    const isPublished = post.published;

    if (!wasPublished && isPublished) {
      pubsub.publish('post', { post: { mutation: 'CREATED', data: post } });
    } else if (wasPublished && !isPublished) {
      pubsub.publish('post', {
        post: { mutation: 'DELETED', data: originalPost },
      });
    } else if (isPublished) {
      pubsub.publish('post', { post: { mutation: 'UPDATED', data: post } });
    }

    return post;
  },

  // --- COMMENT MUTATIONS ---

  async createComment(
    parent: any,
    args: CommentMutationArgs,
    { prisma, pubsub }: Context
  ): Promise<Comment> {
    const post = await prisma.post.findUnique({
      where: { id: args.data.post, published: true },
    });

    if (!post) {
      throw new Error('Unable to find user and post');
    }

    try {
      const comment = await prisma.comment.create({
        data: {
          text: args.data.text,
          author: { connect: { id: args.data.author } },
          post: { connect: { id: args.data.post } },
        },
      });

      pubsub.publish(`comment ${comment.postId}`, {
        comment: { mutation: 'CREATED', data: comment },
      });

      return comment;
    } catch (e: any) {
      if (e.code === 'P2003') {
        throw new Error('Unable to find user and post');
      }
      throw e;
    }
  },

  async deleteComment(
    parent: any,
    args: { id: number },
    { prisma, pubsub }: Context
  ): Promise<Comment> {
    const deletedComment = await prisma.comment.findUnique({
      where: { id: args.id },
    });

    if (!deletedComment) {
      throw new Error('Comment not found');
    }

    const comment = await prisma.comment.delete({ where: { id: args.id } });

    pubsub.publish(`comment ${deletedComment.postId}`, {
      comment: { mutation: 'DELETED', data: comment },
    });

    return comment;
  },

  async updateComment(
    parent: any,
    args: { id: number; data: Prisma.CommentUpdateInput },
    { prisma, pubsub }: Context
  ): Promise<Comment> {
    const comment = await prisma.comment.update({
      where: { id: args.id },
      data: args.data,
    });

    pubsub.publish(`comment ${comment.postId}`, {
      comment: { mutation: 'UPDATED', data: comment },
    });

    return comment;
  },
};

export { Mutation as default };
