import {
  DeleteOneResumeArgs,
  FindFirstResumeArgs,
  Resume,
  UpdateOneResumeArgs
} from '@/prisma/graphql';
import { TakeLimit } from '@/utils/pipes/take-limit.decorator';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserRole } from '@prisma/client';
import { I18nService } from 'nestjs-i18n';
import { AuthRoles } from '../auth/passport/jwt/jwt.decorator';
import { ResumeService } from './resume.service';
import {
  AllResumeArgs,
  AllResumeResult,
  CreateResumeArgs,
  MyResumeArgs,
  ResumePreviewResult
} from './resume-type.type';

@Resolver(() => Resume)
export class ResumeResolver {
  constructor(
    private readonly i18n: I18nService,
    private readonly resumeService: ResumeService
  ) {}

  @Mutation(() => Resume, { name: 'create_resume' })
  async createResume(@Args() args: CreateResumeArgs) {
    return this.resumeService.createResume(args);
  }

  @Mutation(() => Resume, { name: 'update_resume' })
  async update(@Args() args: UpdateOneResumeArgs): Promise<Resume> {
    return this.resumeService.update(args);
  }

  @Mutation(() => Resume, { name: 'delete_resume' })
  @AuthRoles({ roles: [UserRole.admin, UserRole.super_admin] })
  delete(@Args() args: DeleteOneResumeArgs) {
    return this.resumeService.delete(args);
  }

  @Query(() => AllResumeResult, { name: 'all_resume' })
  all(@Args(new TakeLimit()) args: AllResumeArgs) {
    return this.resumeService.findMany(args);
  }

  @Query(() => Resume, { name: 'one_resume' })
  @AuthRoles()
  findOne(@Args() args: FindFirstResumeArgs) {
    return this.resumeService.findFirst(args);
  }

  @Mutation(() => ResumePreviewResult, { name: 'preview_resume' })
  async preview(@Args() args: CreateResumeArgs) {
    const res = await this.resumeService.preview(args);
    return {
      imgBase64: res.imgBase64,
      pdfBase64: res.pdfBase64
    };
  }

  @Query(() => AllResumeResult, { name: 'my_resume' })
  myResume(@Args(new TakeLimit()) args: MyResumeArgs) {
    return this.resumeService.myResume(args);
  }
}
