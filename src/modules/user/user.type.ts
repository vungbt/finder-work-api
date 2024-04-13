import { User } from '@/prisma/graphql';
import { ArgsType, Field, ObjectType, OmitType } from '@nestjs/graphql';

@ObjectType()
export class UserOnly extends OmitType(User, ['password', 'verifyCode']) {}

@ArgsType()
export class MeArgs {
  @Field()
  userId: string;
}
