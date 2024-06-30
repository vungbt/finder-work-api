import { FindManyTagArgs, Tag } from '@/prisma/graphql';
import { Metadata, PaginationInput } from '@/types';
import { ArgsType, Field, ObjectType } from '@nestjs/graphql';

@ArgsType()
export class AllTagArgs extends FindManyTagArgs {
  @Field(() => PaginationInput, { nullable: true })
  pagination?: PaginationInput;

  @Field(() => String, { nullable: true })
  searchValue?: string;
}

@ObjectType()
export class AllTagResult {
  @Field(() => [Tag])
  data: Tag[];

  @Field(() => Metadata, { nullable: true })
  metadata?: Metadata;
}
