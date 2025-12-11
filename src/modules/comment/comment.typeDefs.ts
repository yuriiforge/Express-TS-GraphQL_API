import { readFileSync } from 'fs';
import { join } from 'path';
import { gql } from 'graphql-tag';

const commentTypeDefs = gql(
  readFileSync(join(__dirname, 'comment.schema.graphql'), 'utf-8')
);

export { commentTypeDefs };
