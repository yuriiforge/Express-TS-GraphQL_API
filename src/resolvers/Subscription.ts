import { Context } from '../types/Context';
import { PubSub } from 'graphql-subscriptions';
import { Post } from '@prisma/client';

interface CommentSubscriptionArgs {
  postId: number;
}

const SubscriptionResolver = {
  comment: {
    async subscribe(
      parent: any,
      { postId }: CommentSubscriptionArgs,
      { prisma, pubsub }: Context
    ) {
      const post: Post | null = await prisma.post.findUnique({
        where: { id: postId, published: true },
      });

      if (!post) {
        throw new Error('Post not found');
      }

      return pubsub.asyncIterableIterator(`comment ${postId}`);
    },
  },

  post: {
    subscribe(parent: any, args: any, { pubsub }: Context) {
      return pubsub.asyncIterableIterator('post');
    },
  },
};

export { SubscriptionResolver as default };
