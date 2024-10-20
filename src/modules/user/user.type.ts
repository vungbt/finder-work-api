import { FindManyUserArgs, User } from '@/prisma/graphql';
import { Metadata, PaginationInput } from '@/types';
import { ArgsType, Field, ObjectType, OmitType } from '@nestjs/graphql';

@ObjectType()
export class UserOnly extends OmitType(User, ['password', 'verifyCode']) {}

@ArgsType()
export class MeArgs {
  @Field()
  userId: string;
}

@ArgsType()
export class AllUserArgs extends FindManyUserArgs {
  @Field(() => PaginationInput, { nullable: true })
  pagination?: PaginationInput;

  @Field(() => String, { nullable: true })
  searchValue?: string;
}

@ObjectType()
export class AllUserResult {
  @Field(() => [User])
  data: User[];

  @Field(() => Metadata, { nullable: true })
  metadata?: Metadata;
}
