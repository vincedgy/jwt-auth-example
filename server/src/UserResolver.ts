import 'dotenv/config';
import logger from 'loggy';
import {
  Resolver,
  Query,
  Mutation,
  Arg,
  ObjectType,
  Field,
  Ctx
} from 'type-graphql';
import { User } from './entity/User';
import { sign, Secret } from 'jsonwebtoken';
import { hash, compare } from 'bcryptjs';
import { AppContext } from './AppContext';

const SECRET: Secret = process.env.SECRET || '';
const SECRET_REFRESH: Secret = process.env.SECRET_REFRESH || '';

@ObjectType()
export default class LoginResponse {
  @Field()
  accessToken: string;
}

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return 'hi !';
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

  @Mutation(() => LoginResponse)
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() {res}: AppContext  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error('Invalid login or password !');
    }

    const valid = await compare(password, user.password);
    if (!valid) {
      throw new Error('Invalid login or password !!');
    }

    // login successful
    res.cookie(
        'jid',
        sign( { userId: user.id, userEmail: user.email }, SECRET_REFRESH , { expiresIn: '7d' }),
         { httpOnly: true }
        )

    return {
      accessToken: sign( { userId: user.id, userEmail: user.email }, SECRET, { expiresIn: '15m' })
    };
  }
}
