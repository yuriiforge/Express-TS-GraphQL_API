import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { GraphQLModule } from '../types/GraphQLModule';

export function buildSchemaFromModules(modules: GraphQLModule[]) {
  const typeDefs = mergeTypeDefs(
    modules.filter((m) => m.typeDefs).map((m) => m.typeDefs!)
  );

  const resolvers = mergeResolvers(
    modules.filter((m) => m.resolvers).map((m) => m.resolvers!)
  );

  return { typeDefs, resolvers };
}
