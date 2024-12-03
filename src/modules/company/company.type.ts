import { Company, CompanyCreateInput, FindManyCompanyArgs } from '@/prisma/graphql';
import { Metadata, PaginationInput } from '@/types';
import { ArgsType, Field, InputType, ObjectType, OmitType } from '@nestjs/graphql';
import { Type } from 'class-transformer';

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

@InputType()
export class CreateCompanyInput extends OmitType(CompanyCreateInput, ['slug']) {
  @Field(() => String, { nullable: true })
  avatarPath: string;

  @Field(() => [String], { nullable: true, defaultValue: [] })
  photosIds: string[];

  @Field(() => [String], { nullable: true })
  jobCategoriesIds: string[];
}

@ArgsType()
export class CreateCompanyArgs {
  @Field(() => CreateCompanyInput, { nullable: false })
  @Type(() => CreateCompanyInput)
  data!: InstanceType<typeof CreateCompanyInput>;
}
