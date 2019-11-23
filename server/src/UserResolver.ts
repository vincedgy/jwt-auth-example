import 'dotenv/config';
import logger from 'loggy';
import {
  Resolver,
  Query,
  Mutation,
  Arg,
  ObjectType,
  Field,
  Ctx,
  UseMiddleware
} from 'type-graphql';
import { User } from './entity/User';
import { hash, compare } from 'bcryptjs';
import { AppContext } from './AppContext';
import { createAccessToken, createRefreshToken } from './auth';
import { isAuth } from './isAuth';
import { sendRefreshToken } from './sendRefreshToken';
import { getConnection } from 'typeorm';
import { Int } from 'type-graphql';

@ObjectType()
export default class LoginResponse {
  @Field()
  accessToken: string;
}

@Resolver()
export class UserResolver {
  @Query(() => String)
  @UseMiddleware(isAuth)
  whoami(@Ctx() { payload }: AppContext) {
    if (!payload) {
      return `Not authenticated`;
    }
    logger.log(payload);
    return `Hello ${payload!.userEmail}`;
  }

  @Query(() => [User])
  users() {
    return User.find();
  }

  @Mutation(() => Boolean)
  async register(
    @Arg('email') email: string,
    @Arg('password') password: string
  ): Promise<Boolean> {
    const hashedPassword = await hash(password, 12);
    try {
      await User.insert({
        email,
        password: hashedPassword
      });
    } catch (err) {
      logger.error(err);
      return false;
    }
    return true;
  }

  @Mutation(() => Boolean)
  async revokeRefreshTokensForUser(@Arg('userId', () => Int) userId: number) {
    await getConnection()
      .getRepository(User)
      .increment({ id: userId }, 'tokenVersion', 1);
    return true;
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() { res }: AppContext
  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('Invalid login or password !');
    }

    const valid = await compare(password, user.password);
    if (!valid) {
      throw new Error('Invalid login or password !!');
    }

    // login successful
    sendRefreshToken(res, createRefreshToken(user));

    return {
      accessToken: createAccessToken(user)
    };
  }
}
