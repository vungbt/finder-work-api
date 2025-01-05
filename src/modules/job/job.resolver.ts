import {
  City,
  Company,
  DeleteOneJobArgs,
  FindFirstJobArgs,
  JobCategory,
  JobTitle,
  Skill,
  Tag,
  UpdateOneJobArgs
} from '@/prisma/graphql';
import { ContextType } from '@/types';
import { TakeLimit } from '@/utils/pipes/take-limit.decorator';
import { Args, Context, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UserRole } from '@prisma/client';
import { AuthRoles } from '../auth/passport/jwt/jwt.decorator';
import { JobService } from './job.service';
import { AllJobArgs, AllJobResult, CreateJobArgs, JobItem, MyJobArgs } from './job.type';

@Resolver(() => JobItem)
export class JobResolver {
  constructor(private readonly jobService: JobService) {}

  @Mutation(() => JobItem, { name: 'create_job' })
  @AuthRoles({ roles: [UserRole.employer] })
  create(@Args() args: CreateJobArgs, @Context() ctx: ContextType) {
    return this.jobService.create(args, ctx.req.user);
  }

  @Mutation(() => JobItem, { name: 'update_job' })
  update(@Args() args: UpdateOneJobArgs) {
    return this.jobService.update(args);
  }

  @Mutation(() => JobItem, { name: 'delete_job' })
  delete(@Args() args: DeleteOneJobArgs) {
    return this.jobService.delete(args);
  }

  @Query(() => AllJobResult, { name: 'all_job' })
  allJob(@Args(new TakeLimit()) args: AllJobArgs) {
    return this.jobService.allJob(args);
  }

  @Query(() => JobItem, { name: 'one_job' })
  findOne(@Args() args: FindFirstJobArgs) {
    return this.jobService.findFirst(args);
  }

  @Query(() => AllJobResult, { name: 'my_job' })
  myJob(@Args(new TakeLimit()) args: MyJobArgs) {
    return this.jobService.myJob(args);
  }

  @ResolveField(() => Company)
  async company(@Parent() job: JobItem, @Context() { loaders }: ContextType) {
    if (!job.id || !job || !job.companyId) return null;
    return loaders.companyUnique.load(job.companyId);
  }

  @ResolveField(() => JobTitle)
  async jobTitle(@Parent() job: JobItem, @Context() { loaders }: ContextType) {
    if (!job.id || !job || !job.jobTitleId) return null;
    return loaders.jobTitleUnique.load(job.jobTitleId);
  }

  @ResolveField(() => JobCategory)
  async jobCategory(@Parent() job: JobItem, @Context() { loaders }: ContextType) {
    if (!job.id || !job || !job.jobCategoryId) return null;
    return loaders.jobCategoryUnique.load(job.jobCategoryId);
  }

  @ResolveField(() => City)
  async address(@Parent() job: JobItem, @Context() { loaders }: ContextType) {
    if (!job.id || !job || !job.cityId) return null;
    return loaders.cityUnique.load(job.cityId);
  }

  @ResolveField(() => [Skill])
  async skills(@Parent() job: JobItem, @Context() { loaders }: ContextType) {
    if (!job.skills || job.skills.length < 0) return [];
    const skillIds = job.skills.map((item) => item.id);
    return loaders.skillMany.load(skillIds);
  }

  @ResolveField(() => [Tag])
  async tags(@Parent() job: JobItem, @Context() { loaders }: ContextType) {
    if (!job.tags || job.tags.length < 0) return [];
    const tagIds = job.tags.map((item) => item.id);
    return loaders.tagMany.load(tagIds);
  }
}
