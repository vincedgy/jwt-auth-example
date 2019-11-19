import 'dotenv/config'
import { User } from './entity/User';
import { sign, Secret } from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET: Secret = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET: Secret = process.env.REFRESH_TOKEN_SECRET!;

export const createAccessToken = (user: User) => {
  return sign({ userId: user.id, userEmail: user.email }, ACCESS_TOKEN_SECRET, {
    expiresIn: '15m'
  })
}

export const createRefreshToken = (user: User) => {
  return sign({ userId: user.id, userEmail: user.email }, REFRESH_TOKEN_SECRET, {
    expiresIn: '7d'
  })
}
