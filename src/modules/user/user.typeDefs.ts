import { readFileSync } from 'fs';
import { join } from 'path';
import { gql } from 'graphql-tag';

const userTypeDefs = gql(
  readFileSync(join(__dirname, 'user.schema.graphql'), { encoding: 'utf-8' })
);

export { userTypeDefs };
