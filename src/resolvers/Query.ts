import { Context } from '../types/Context';
import { Prisma, User, Post, Comment } from '@prisma/client';

interface QueryArgs {
  query?: string;
  id: number;
}

const Query = {
  async users(
    parent: any,
    args: QueryArgs,
    { prisma }: Context
  ): Promise<User[]> {
    const where: Prisma.UserWhereInput = {};

    if (args.query) {
      where.name = {
        contains: args.query,
        mode: 'insensitive',
      };
    }

    return prisma.user.findMany({ where });
  },

  async posts(
    parent: any,
    args: QueryArgs,
    { prisma }: Context
  ): Promise<Post[]> {
    const where: Prisma.PostWhereInput = {
      published: true,
    };

    if (args.query) {
      where.OR = [
        { title: { contains: args.query, mode: 'insensitive' } },
        { body: { contains: args.query, mode: 'insensitive' } },
      ];
    }

    return prisma.post.findMany({ where });
  },

  async comments(
    parent: any,
    args: any,
    { prisma }: Context
  ): Promise<Comment[]> {
    return prisma.comment.findMany();
  },

  me() {
    return {
      id: 123098,
      name: 'Mike',
      email: 'mike@example.com',
    };
  },

  async post(
    parent: any,
    args: { id: number },
    { prisma }: Context
  ): Promise<Post> {
    return prisma.post.findUniqueOrThrow({
      where: { id: args.id },
    });
  },
};

export { Query as default };
