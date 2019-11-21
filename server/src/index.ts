import 'dotenv/config';
import 'reflect-metadata';
import logger from 'loggy';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { UserResolver } from './UserResolver';
import { createConnection } from 'typeorm';
import cookieParser from 'cookie-parser';
import { verify, Secret } from 'jsonwebtoken';
import { User } from './entity/User';
import { createAccessToken } from './auth';

const PORT = process.env.PORT || 4000;

// Async main
(async () => {
  const app = express();

  app.use(cookieParser());

  app.get('/', (_req, res) => {
    res.send('UP');
  });

  app.post('/refresh_token', async (req, res) => {
    const REFRESH_TOKEN_SECRET: Secret = process.env.REFRESH_TOKEN_SECRET!;
    const token = req.cookies.jid;
    if (!token) {
      return res.send({ ok: false, accessToken: '' });
    }
    let payload:any = null;
    try {
      payload = verify(token, REFRESH_TOKEN_SECRET);
    } catch (err) {
      logger.error(err);
    }

    // refresh token is valid
    // and we can send back a refresh token
    const user = await User.findOne({id: payload.userId})
    if (!user) {
      return res.send({ ok: false, accessToken: '' });
    }
    return res.send({ ok: true, accessToken: createAccessToken(user) });
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
