import 'dotenv/config';
import 'reflect-metadata';
import logger from 'loggy';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { UserResolver } from './UserResolver';
import { createConnection } from 'typeorm';
import cookieParser from 'cookie-parser';
import { Response, Request } from 'express';
import { refreshToken } from './refreshToken';

const PORT = process.env.PORT || 4000;

// Async main
(async () => {
  const app = express();

  app.use(cookieParser());

  app.get('/', (_req, res) => {
    res.send('UP');
  });

  app.post('/refresh_token', async (req: Request, res: Response) => {
    return refreshToken(req, res)
  });

  await createConnection();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver]
    }),
    // Request and Response are inside context so we can access from resolver !
    context: ({ res, req }) => ({ res, req })
  });

  apolloServer.applyMiddleware({ app });

  app.listen(PORT, () => {
    logger.info(`🚀 Server's ready at http://localhost:${PORT}/`);
  });
})();
