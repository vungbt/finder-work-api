import { FindManyPostCategoryArgs, PostCategory } from '@/prisma/graphql';
import { Metadata, PaginationInput } from '@/types';
import { ArgsType, Field, ObjectType } from '@nestjs/graphql';

@ArgsType()
export class AllPostCategoryArgs extends FindManyPostCategoryArgs {
  @Field(() => String, { nullable: true })
  searchValue?: string;

  @Field(() => PaginationInput, { nullable: true })
  pagination?: PaginationInput;
}

@ObjectType()
export class AllPostCategoryResult {
  @Field(() => [PostCategory], { defaultValue: [] })
  data: PostCategory[];

  @Field(() => Metadata, { nullable: true })
  metadata?: Metadata;
}
