import { GraphQLModule } from '../../types/GraphQLModule';
import { postResolvers } from './post.resolver';
import { PostService } from './post.service';
import { postTypeDefs } from './post.typeDefs';

export const PostModule: GraphQLModule = {
  typeDefs: postTypeDefs,
  resolvers: postResolvers,
  providers: [PostService],
  exports: [PostService],
};
