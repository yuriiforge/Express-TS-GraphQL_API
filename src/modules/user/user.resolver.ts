import { User } from '@prisma/client';
import { Context } from '../../types/Context';
import { CreateUserInput } from './dtos/create-user-input';
import { LoginUserInput } from './dtos/login-input';
import { UserService } from './user.service';
import { QueryParams } from '../../types/QueryParams';
import prisma from '../../prisma';
import { hashService } from '../../services/hash.service';

let userService = new UserService(prisma, hashService);

export const __setUserService = (mock: any) => {
  userService = mock;
};

export const userResolvers = {
  Query: {
    users: async (
      _parent: unknown,
      args: { query?: string; skip?: number; first?: number },
      ctx: Context
    ): Promise<User[]> => {
      return userService.getUsers({
        query: args.query,
        skip: args.skip,
        take: args.first,
      } as QueryParams);
    },

    me: async (_parent: unknown, _args: {}, ctx: Context): Promise<User> => {
      const userId = ctx.userId;
      if (!userId) {
        throw new Error('You are not authorized');
      }
      const user = await userService.getUserById(parseInt(userId));

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    },
  },

  Mutation: {
    createUser: async (
      _parent: unknown,
      args: { data: CreateUserInput },
      ctx: Context
    ) => {
      return userService.createUser(args.data);
    },

    login: async (
      _parent: unknown,
      args: { data: LoginUserInput },
      ctx: Context
    ) => {
      return userService.login(args.data);
    },

    updateUser: async (
      _parent: unknown,
      args: { id: number; data: Partial<User> },
      ctx: Context
    ) => {
      return userService.updateUser(args.id, args.data);
    },

    deleteUser: async (
      _parent: unknown,
      args: { id: number },
      ctx: Context
    ) => {
      return userService.deleteUser(args.id);
    },
  },
};
