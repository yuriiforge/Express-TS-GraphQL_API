import { makeExecutableSchema } from '@graphql-tools/schema';
import { graphqlHTTP } from 'express-graphql';
import { PubSub } from 'graphql-subscriptions';
import { WebSocketServer } from 'ws';
import express from 'express';
import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';
import Subscription from './resolvers/Subscription';
import User from './resolvers/User';
import Post from './resolvers/Post';
import Comment from './resolvers/Comment';
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { createServer } from 'node:http';
import { useServer } from 'graphql-ws/use/ws';
import prisma from './prisma';

const pubsub = new PubSub();
const typeDefs = fs.readFileSync(
  path.join(__dirname, 'schema.graphql'),
  'utf-8'
);

const resolvers = {
  Query,
  Mutation,
  Subscription,
  User,
  Post,
  Comment,
};

const schema = makeExecutableSchema({ typeDefs, resolvers });
const app = express();

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    context: { prisma, pubsub },
    graphiql: { defaultQuery: 'ws://localhost:4000/graphql' },
  })
);

const server = createServer(app);

const wsServer = new WebSocketServer({
  server,
  path: '/graphql',
});

useServer({ schema, context: () => ({ prisma, pubsub }) }, wsServer);

server.listen(4000, () => {
  console.log('Server running on http://localhost:4000/graphql');
  console.log('Subscriptions running on ws://localhost:4000/graphql');
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
