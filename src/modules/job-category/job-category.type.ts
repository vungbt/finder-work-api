import { FindManyJobCategoryArgs, JobCategory } from '@/prisma/graphql';
import { Metadata, PaginationInput } from '@/types';
import { ArgsType, Field, ObjectType } from '@nestjs/graphql';

@ArgsType()
export class AllJobCategoryArgs extends FindManyJobCategoryArgs {
  @Field(() => String, { nullable: true })
  searchValue?: string;

  @Field(() => PaginationInput, { nullable: true })
  pagination?: PaginationInput;
}

@ObjectType()
export class AllJobCategoryResult {
  @Field(() => [JobCategory], { defaultValue: [] })
  data: JobCategory[];

  @Field(() => Metadata, { nullable: true })
  metadata?: Metadata;
}
