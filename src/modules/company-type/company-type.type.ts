import { CompanyType, FindManyCompanyTypeArgs } from '@/prisma/graphql';
import { Metadata, PaginationInput } from '@/types';
import { ArgsType, Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AllCompanyTypeResult {
  @Field(() => [CompanyType])
  data: CompanyType[];

  @Field(() => Metadata, { nullable: true })
  metadata?: Metadata;
}

@ArgsType()
export class AllCompanyTypeArgs extends FindManyCompanyTypeArgs {
  @Field(() => String, { nullable: true })
  searchValue?: string;

  @Field(() => PaginationInput, { nullable: true })
  pagination?: PaginationInput;
}
