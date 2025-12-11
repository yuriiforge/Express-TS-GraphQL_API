import { Comment, Post, User } from '@prisma/client';
import { Context } from '../types/Context';

const CommentResolver = {
  author(parent: Comment, args: any, { prisma }: Context): Promise<User> {
    return prisma.user.findUniqueOrThrow({
      where: { id: parent.authorId },
    });
  },
  async post(parent: Comment, args: any, { prisma }: Context): Promise<Post> {
    return prisma.post.findUniqueOrThrow({
      where: { id: parent.postId },
    });
  },
};

export { CommentResolver as default };
