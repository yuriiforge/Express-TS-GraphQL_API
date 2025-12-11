import { DocumentNode } from 'graphql';

export interface GraphQLModule {
  typeDefs?: string | DocumentNode;
  resolvers?: any;
  providers?: Constructor<any>[];
  exports?: Constructor<any>[];
  imports?: GraphQLModule[];
}

export type Constructor<T> = new (...args: any[]) => T;
