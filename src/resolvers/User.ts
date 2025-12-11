import { Context } from '../types/Context';
import { User, Post, Comment } from '@prisma/client';

const UserResolver = {
  async posts(parent: User, args: any, { prisma }: Context): Promise<Post[]> {
    return prisma.post.findMany({
      where: { authorId: parent.id },
    });
  },

  async comments(
    parent: User,
    args: any,
    { prisma }: Context
  ): Promise<Comment[]> {
    return prisma.comment.findMany({
      where: { authorId: parent.id },
    });
  },
};

export { UserResolver as default };
