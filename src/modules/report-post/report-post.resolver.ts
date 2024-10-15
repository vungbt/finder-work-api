import {
  CreateOneReportPostArgs,
  DeleteOneReportPostArgs,
  FindFirstReportPostArgs,
  ReportPost,
  UpdateOneReportPostArgs
} from '@/prisma/graphql';
import { TakeLimit } from '@/utils/pipes/take-limit.decorator';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserRole } from '@prisma/client';
import { AuthRoles } from '../auth/passport/jwt/jwt.decorator';
import { ReportPostService } from './report-post.service';
import { AllReportPostArgs, AllReportPostResult } from './report-post.type';

@Resolver(() => ReportPost)
export class ReportPostResolver {
  constructor(private readonly reportPostService: ReportPostService) {}

  @Mutation(() => ReportPost, { name: 'create_report_post' })
  create(@Args() args: CreateOneReportPostArgs) {
    return this.reportPostService.create(args);
  }

  @Mutation(() => ReportPost, { name: 'update_report_post' })
  @AuthRoles({ roles: [UserRole.admin] })
  update(@Args() args: UpdateOneReportPostArgs) {
    return this.reportPostService.update(args);
  }

  @Mutation(() => ReportPost, { name: 'delete_report_post' })
  @AuthRoles({ roles: [UserRole.admin] })
  delete(@Args() args: DeleteOneReportPostArgs) {
    return this.reportPostService.delete(args);
  }

  @Query(() => AllReportPostResult, { name: 'all_report_post' })
  all(@Args(new TakeLimit()) args: AllReportPostArgs) {
    return this.reportPostService.findAll(args);
  }

  @Query(() => ReportPost, { name: 'one_report_post' })
  findOne(@Args() args: FindFirstReportPostArgs) {
    return this.reportPostService.findFirst(args);
  }
}
