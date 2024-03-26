import { CompanySize, FindManyCompanySizeArgs } from '@/prisma/graphql';
import { Metadata, PaginationInput } from '@/types';
import { ArgsType, Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AllCompanySizeResult {
  @Field(() => [CompanySize])
  data: CompanySize[];

  @Field(() => Metadata, { nullable: true })
  metadata?: Metadata;
}

@ArgsType()
export class AllCompanySizeArgs extends FindManyCompanySizeArgs {
  @Field(() => String, { nullable: true })
  searchValue?: string;

  @Field(() => PaginationInput, { nullable: true })
  pagination?: PaginationInput;
}
