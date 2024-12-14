import {
  DeleteOneJobArgs,
  FindFirstJobArgs,
  FindManyJobArgs,
  Job,
  UpdateOneJobArgs
} from '@/prisma/graphql';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserRole } from '@prisma/client';
import { AuthRoles } from '../auth/passport/jwt/jwt.decorator';
import { JobService } from './job.service';
import { AllJobArgs, CreateJobArgs } from './job.type';
import { ContextType } from '@/types';
import { TakeLimit } from '@/utils/pipes/take-limit.decorator';

@Resolver(() => Job)
export class JobResolver {
  constructor(private readonly jobService: JobService) {}

  @Mutation(() => Job, { name: 'create_job' })
  @AuthRoles({ roles: [UserRole.employer] })
  create(@Args() args: CreateJobArgs, @Context() ctx: ContextType) {
    return this.jobService.create(args, ctx.req.user);
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
  myJob(@Args(new TakeLimit()) args: AllJobArgs) {
    return this.jobService.myJob(args);
  }
}
