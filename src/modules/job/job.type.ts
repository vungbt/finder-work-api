import {
  CompanyCreateInput,
  FindManyJobArgs,
  Job,
  JobCreateInput,
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
  @Field(() => [Job])
  data: Job[];

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
