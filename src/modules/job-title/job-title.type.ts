import { FindManyJobTitleArgs, JobTitle } from '@/prisma/graphql';
import { Metadata, PaginationInput } from '@/types';
import { ArgsType, Field, ObjectType } from '@nestjs/graphql';

@ArgsType()
export class AllJobTitleArgs extends FindManyJobTitleArgs {
  @Field(() => String, { nullable: true })
  searchValue?: string;

  @Field(() => PaginationInput, { nullable: true })
  pagination?: PaginationInput;
}

@ObjectType()
export class AllJobTitleResult {
  @Field(() => [JobTitle], { defaultValue: [] })
  data: JobTitle[];

  @Field(() => Metadata, { nullable: true })
  metadata?: Metadata;
}
