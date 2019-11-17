import logger from 'loggy';
import {
  Resolver,
  Query,
  Mutation,
  Arg,
  ObjectType,
  Field
} from 'type-graphql';
import { User } from './entity/User';
import { sign } from 'jsonwebtoken';
import { hash, compare } from 'bcryptjs';

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
    @Arg('password') password: string
  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error('Invalid login');
    }

    const valid = await compare(password, user.password);
    if (!valid) {
      throw new Error('Invalid login');
    }

    // login successful

    return {
      accessToken: sign(
        {
          userId: user.id,
          userEmail: user.email
        },
        'secret',
        { expiresIn: '15m' }
      )
    };
  }
}
