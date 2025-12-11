import { Context } from '../types/Context';
import { Post, User, Comment } from '@prisma/client';

const PostResolver = {
  async author(parent: Post, args: any, { prisma }: Context): Promise<User> {
    return prisma.user.findUniqueOrThrow({
      where: { id: parent.authorId },
    });
  },

  async comments(
    parent: Post,
    args: any,
    { prisma }: Context
  ): Promise<Comment[]> {
    return prisma.comment.findMany({
      where: { postId: parent.id },
    });
  },
};

export { PostResolver as default };
