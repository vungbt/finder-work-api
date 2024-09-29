import {
  CreateOneJobCategoryArgs,
  DeleteOneJobCategoryArgs,
  FindFirstJobCategoryArgs,
  JobCategory,
  UpdateOneJobCategoryArgs
} from '@/prisma/graphql';
import { TakeLimit } from '@/utils/pipes/take-limit.decorator';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JobCategoryService } from './job-category.service';
import { AllJobCategoryArgs, AllJobCategoryResult } from './job-category.type';

@Resolver(() => JobCategory)
export class JobCategoryResolver {
  constructor(private readonly jobCategoryService: JobCategoryService) {}

  @Mutation(() => JobCategory, { name: 'create_job_category' })
  create(@Args() args: CreateOneJobCategoryArgs) {
    return this.jobCategoryService.create(args);
  }

  @Mutation(() => JobCategory, { name: 'update_job_category' })
  update(@Args() args: UpdateOneJobCategoryArgs) {
    return this.jobCategoryService.update(args);
  }

  @Mutation(() => JobCategory, { name: 'delete_job_category' })
  delete(@Args() args: DeleteOneJobCategoryArgs) {
    return this.jobCategoryService.delete(args);
  }

  @Query(() => AllJobCategoryResult, { name: 'all_job_category' })
  all(@Args(new TakeLimit()) args: AllJobCategoryArgs) {
    return this.jobCategoryService.findMany(args);
  }

  @Query(() => JobCategory, { name: 'one_job_category' })
  findOne(@Args() args: FindFirstJobCategoryArgs) {
    return this.jobCategoryService.findFirst(args);
  }
}
