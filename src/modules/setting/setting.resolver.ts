import {
  CreateOneSettingArgs,
  DeleteOneSettingArgs,
  FindFirstSettingArgs,
  Setting,
  UpdateOneSettingArgs,
  UserRole
} from '@/prisma/graphql';
import { ContextType, CurrentUser } from '@/types';
import { Args, Context, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { AuthRoles } from '../auth/passport/jwt/jwt.decorator';
import { SettingService } from './setting.service';
import { AllSettingLandingPageArgs, AllSettingPortalArgs, AllSettingResult } from './setting.type';
import { TakeLimit } from '@/utils/pipes/take-limit.decorator';
import { UserOnly } from '../user/user.type';
import { IDataloaders } from '../common/dataloader/dataloader.type';

@Resolver(() => Setting)
export class SettingResolver {
  constructor(private readonly settingService: SettingService) {}

  @Mutation(() => Setting, { name: 'create_setting' })
  @AuthRoles({ roles: [UserRole.admin, UserRole.super_admin] })
  create(@Args() args: CreateOneSettingArgs, @Context() ctx: ContextType) {
    return this.settingService.create(args, ctx.req.user);
  }

  @Mutation(() => Setting, { name: 'update_setting' })
  @AuthRoles({ roles: [UserRole.admin, UserRole.super_admin] })
  update(@Args() args: UpdateOneSettingArgs, @Context() ctx: ContextType) {
    return this.settingService.update(args, ctx.req.user);
  }

  @Mutation(() => Setting, { name: 'delete_setting' })
  @AuthRoles({ roles: [UserRole.admin, UserRole.super_admin] })
  delete(@Args() args: DeleteOneSettingArgs) {
    return this.settingService.delete(args);
  }

  @Query(() => Setting, { name: 'one_setting' })
  @AuthRoles({ roles: [UserRole.admin, UserRole.super_admin] })
  findOne(@Args() args: FindFirstSettingArgs) {
    return this.settingService.findFirst(args);
  }

  @Query(() => AllSettingResult, { name: 'setting_portal' })
  @AuthRoles()
  findPortal(@Args(new TakeLimit()) @Args() args: AllSettingPortalArgs, @Context() ctx: any) {
    const currentUser = ctx.req.user as CurrentUser;
    return this.settingService.findAllSettingPortal(args, currentUser);
  }

  @Query(() => AllSettingResult, { name: 'setting_landing_page' })
  findLandingPage(@Args(new TakeLimit()) @Args() args: AllSettingLandingPageArgs) {
    return this.settingService.findAllSettingLandingPage(args);
  }

  @ResolveField(() => UserOnly)
  author(@Parent() setting: Setting, @Context() { loaders }: { loaders: IDataloaders }) {
    if (!setting.authorId) return null;
    return loaders.userUnique.load(setting.authorId);
  }

  @ResolveField(() => UserOnly)
  updatedBy(@Parent() setting: Setting, @Context() { loaders }: { loaders: IDataloaders }) {
    if (!setting.updatedById) return null;
    return loaders.userUnique.load(setting.updatedById);
  }
}
