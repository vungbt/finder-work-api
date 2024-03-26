import { City, FindManyCityArgs } from '@/prisma/graphql';
import { Metadata, PaginationInput } from '@/types';
import { ArgsType, Field, ObjectType } from '@nestjs/graphql';

@ArgsType()
export class AllAddressArgs extends FindManyCityArgs {
  @Field(() => String, { nullable: true })
  searchValue?: string;

  @Field(() => PaginationInput, { nullable: true })
  pagination?: PaginationInput;
}

@ObjectType()
export class Address {
  @Field(() => [City])
  data: City[];

  @Field(() => Metadata, { nullable: true })
  metadata?: Metadata;
}
