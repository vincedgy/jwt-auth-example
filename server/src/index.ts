import 'dotenv/config';
import 'reflect-metadata';
import logger from 'loggy';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { UserResolver } from './UserResolver';
import { createConnection } from 'typeorm';

const PORT = process.env.PORT || 4000;

// Async main
(async () => {
  const app = express();

  app.get('/', (_req, res) => {
    res.send('UP');
  });

  await createConnection();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver]
    })
  });

  apolloServer.applyMiddleware({ app });

  app.listen(PORT, () => {
    logger.info(`🚀 Server's ready at http://localhost:${PORT}/`);
  });
})();
