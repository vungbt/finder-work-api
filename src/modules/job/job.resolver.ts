import {
  CreateOneJobArgs,
  DeleteOneJobArgs,
  FindFirstJobArgs,
  FindManyJobArgs,
  Job,
  UpdateOneJobArgs
} from '@/prisma/graphql';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JobService } from './job.service';

@Resolver(() => Job)
export class JobResolver {
  constructor(private readonly jobService: JobService) {}

  @Mutation(() => Job, { name: 'create_job' })
  create(@Args() args: CreateOneJobArgs) {
    return this.jobService.create(args);
  }

  @Mutation(() => Job, { name: 'update_job' })
  update(@Args() args: UpdateOneJobArgs) {
    return this.jobService.update(args);
  }

  @Mutation(() => Job, { name: 'delete_job' })
  delete(@Args() args: DeleteOneJobArgs) {
    return this.jobService.delete(args);
  }

  @Query(() => [Job], { name: 'all_job' })
  all(@Args() args: FindManyJobArgs) {
    return this.jobService.findMany(args);
  }

  @Query(() => Job, { name: 'one_job' })
  findOne(@Args() args: FindFirstJobArgs) {
    return this.jobService.findFirst(args);
  }
}
