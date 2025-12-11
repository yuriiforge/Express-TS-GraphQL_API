import { commentResolvers } from './comment.resolver';
import { CommentService } from './comment.service';
import { commentTypeDefs } from './comment.typeDefs';

export const CommentModule = {
  typeDefs: commentTypeDefs,
  resolvers: commentResolvers,
  providers: [CommentService],
};
