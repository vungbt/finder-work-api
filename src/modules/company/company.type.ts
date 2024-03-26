import { Company, FindManyCompanyArgs } from '@/prisma/graphql';
import { Metadata, PaginationInput } from '@/types';
import { ArgsType, Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AllCompanyResult {
  @Field(() => [Company])
  data: Company[];

  @Field(() => Metadata, { nullable: true })
  metadata?: Metadata;
}

@ArgsType()
export class AllCompanyArgs extends FindManyCompanyArgs {
  @Field(() => String, { nullable: true })
  searchValue?: string;

  @Field(() => PaginationInput, { nullable: true })
  pagination?: PaginationInput;
}
