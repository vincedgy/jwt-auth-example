import 'dotenv/config';
import 'reflect-metadata';
import logger from 'loggy'
import { sendRefreshToken } from './sendRefreshToken';
import { createAccessToken, createRefreshToken } from './auth';
import { Response, Request } from 'express'
import { verify, Secret } from 'jsonwebtoken'
import { User } from './entity/User'

export const refreshToken = async (req: Request, res: Response) => {
  const REFRESH_TOKEN_SECRET: Secret = process.env.REFRESH_TOKEN_SECRET!;
  const token = req.cookies.jid;
  if (!token) {
    return res.send({ ok: false, accessToken: '' });
  }
  let payload: any = null;
  try {
    payload = verify(token, REFRESH_TOKEN_SECRET);
  } catch (err) {
    logger.error(err);
    return res.send({ ok: false, accessToken: '' });
  }

  // refresh token is valid
  // and we can send back a refresh token
  const user = await User.findOne({ id: payload.userId });
  if (!user) {
    return res.send({ ok: false, accessToken: '' });
  }
  if (user.tokenVersion !== payload.tokenVersion) {
    return res.send({ ok: false, accessToken: '' });
  }
  sendRefreshToken(res, createRefreshToken(user));
  return res.send({ ok: true, accessToken: createAccessToken(user) });
}
