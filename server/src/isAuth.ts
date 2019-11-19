import { MiddlewareFn } from 'type-graphql';
import { AppContext } from './AppContext';
import { verify, Secret } from 'jsonwebtoken';
import logger from 'loggy';

const ACCESS_TOKEN_SECRET: Secret = process.env.ACCESS_TOKEN_SECRET!;

export const isAuth: MiddlewareFn<AppContext> = ({ context }, next) => {
  const authorization = context.req.headers['authorization'];
  if (!authorization) {
    throw new Error(`not authenticated`);
  }
  try {
    const token = authorization.split(' ')[1];
    const payload: any = verify(token, ACCESS_TOKEN_SECRET);
    context.payload = payload;
  } catch (err) {
    logger.error(err);
  }
  return next();
};
