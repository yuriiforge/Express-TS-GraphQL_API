import { GraphQLModule } from '../../types/GraphQLModule';
import { userResolvers } from './user.resolver';
import { UserService } from './user.service';
import { userTypeDefs } from './user.typeDefs';

export const UserModule: GraphQLModule = {
  resolvers: userResolvers,
  providers: [UserService],
  typeDefs: userTypeDefs,
};
