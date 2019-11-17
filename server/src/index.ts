import 'dotenv/config';
import 'reflect-metadata';
import logger from 'loggy';
import express from 'express';
import { ApolloServer } from 'apollo-server-express'

const PORT = process.env.PORT || 4000;

// Async main
(async () => {
  const app = express();

  app.get('/', (_req, res) => {
    res.send('UP');
  });

  const newApolloServer = new ApolloServer({
    typeDefs: `
      type Query {
        hello: String!
      }
    `,
    resolvers: {
      Query: {
        hello: () => 'hello !'
      }
    }

  })


  app.listen(PORT, () => {
    logger.info(`🚀 Server's ready at http://localhost:${PORT}/`);
  });
})();
