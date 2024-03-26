import {
  CreateOneJobTitleArgs,
  DeleteOneJobTitleArgs,
  FindFirstJobTitleArgs,
  FindManyJobTitleArgs,
  JobTitle,
  UpdateOneJobTitleArgs
} from '@/prisma/graphql';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JobTitleService } from './job-title.service';

@Resolver(() => JobTitle)
export class JobTitleResolver {
  constructor(private readonly jobTitleService: JobTitleService) {}

  @Mutation(() => JobTitle, { name: 'create_job_title' })
  create(@Args() args: CreateOneJobTitleArgs) {
    return this.jobTitleService.create(args);
  }

  @Mutation(() => JobTitle, { name: 'update_job_title' })
  update(@Args() args: UpdateOneJobTitleArgs) {
    return this.jobTitleService.update(args);
  }

  @Mutation(() => JobTitle, { name: 'delete_job_title' })
  delete(@Args() args: DeleteOneJobTitleArgs) {
    return this.jobTitleService.delete(args);
  }

  @Query(() => [JobTitle], { name: 'all_job_title' })
  all(@Args() args: FindManyJobTitleArgs) {
    return this.jobTitleService.findMany(args);
  }

  @Query(() => JobTitle, { name: 'one_job_title' })
  findOne(@Args() args: FindFirstJobTitleArgs) {
    return this.jobTitleService.findFirst(args);
  }
}
