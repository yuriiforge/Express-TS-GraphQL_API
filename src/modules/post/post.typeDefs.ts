import { readFileSync } from 'fs';
import { join } from 'path';
import { gql } from 'graphql-tag';

const postTypeDefs = gql(
  readFileSync(join(__dirname, 'post.schema.graphql'), 'utf-8')
);

export { postTypeDefs };
