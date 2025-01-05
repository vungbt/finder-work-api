import {
  City,
  Company,
  CompanyCreateInput,
  FindManyJobArgs,
  Job,
  JobCategory,
  JobCreateInput,
  JobTitle,
  Skill,
  Tag,
  UpdateOneJobArgs
} from '@/prisma/graphql';
import { Metadata, PaginationInput } from '@/types';
import { ArgsType, Field, InputType, ObjectType, OmitType } from '@nestjs/graphql';
import { Type } from 'class-transformer';

@InputType()
export class CreateCompanyInput extends OmitType(CompanyCreateInput, ['slug']) {
  @Field(() => String, { nullable: true })
  avatarPath: string;

  @Field(() => [String], { nullable: true, defaultValue: [] })
  photosIds: string[];

  @Field(() => [String], { nullable: true })
  jobCategoriesIds: string[];
}

@InputType()
export class CreateJobInput extends OmitType(JobCreateInput, ['slug']) {
  @Field(() => [String], { nullable: true, defaultValue: [] })
  skillIds: string[];

  @Field(() => String, { nullable: true })
  companyId?: string;

  @Field(() => String, { nullable: true })
  jobTitleName?: string;
}

@ArgsType()
export class CreateJobArgs {
  @Field(() => CreateJobInput, { nullable: false })
  @Type(() => CreateJobInput)
  data!: InstanceType<typeof CreateJobInput>;
}

@ArgsType()
export class AllJobArgs extends FindManyJobArgs {
  @Field(() => String, { nullable: true })
  searchValue?: string;

  @Field(() => PaginationInput, { nullable: true })
  pagination?: PaginationInput;
}

@ObjectType()
export class AllJobResult {
  @Field(() => [JobItem])
  data: JobItem[];

  @Field(() => Metadata, { nullable: true })
  metadata?: Metadata;
}
@ArgsType()
export class MyJobArgs extends AllJobArgs {
  @Field(() => String, { nullable: false })
  userId: string;
}

@ArgsType()
export class JobResumeArgs extends UpdateOneJobArgs {
  @Field(() => String, { nullable: true })
  resumeId?: string;
}

@ObjectType()
export class JobItem extends OmitType(Job, [
  'company',
  'skills',
  'jobTitle',
  'address',
  'jobCategory',
  'tags'
]) {
  @Field(() => Company, { defaultValue: null })
  company?: Company;

  @Field(() => JobTitle, { defaultValue: null })
  jobTitle?: JobTitle;

  @Field(() => JobCategory, { nullable: true })
  jobCategory?: JobCategory;

  @Field(() => [Skill], { defaultValue: [], nullable: true })
  skills: Skill[];

  @Field(() => City, { defaultValue: null })
  address?: City;

  @Field(() => [Tag], { defaultValue: [], nullable: true })
  tags: Tag[];
}
