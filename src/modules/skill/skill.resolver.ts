import {
  CreateOneSkillArgs,
  DeleteOneSkillArgs,
  FindFirstSkillArgs,
  Skill,
  UpdateOneSkillArgs
} from '@/prisma/graphql';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SkillService } from './skill.service';
import { AllSkillArgs, AllSkillResult } from './skill.type';
import { TakeLimit } from '@/utils/pipes/take-limit.decorator';
import { AuthRoles } from '../auth/passport/jwt/jwt.decorator';
import { UserRole } from '@prisma/client';
import { HttpException, HttpStatus } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

@Resolver(() => Skill)
export class SkillResolver {
  constructor(
    private readonly i18n: I18nService,
    private readonly skillService: SkillService
  ) {}
  @Mutation(() => Skill, { name: 'create_skill' })
  async create(@Args() args: CreateOneSkillArgs): Promise<Skill> {
    const existingSkill = await this.skillService.findUnique({
      where: { content: args.data.content }
    });
    if (existingSkill) {
      throw new HttpException({ key: 'error.skill_error' }, HttpStatus.BAD_REQUEST);
    }
    return this.skillService.create(args);
  }

  @Mutation(() => Skill, { name: 'update_skill' })
  async update(@Args() args: UpdateOneSkillArgs): Promise<Skill> {
    const { content } = args.data;
    const contentString = typeof content === 'object' ? content.set : content;
    const existingSkill = await this.skillService.findUnique({
      where: { content: contentString }
    });

    if (existingSkill) {
      throw new HttpException({ key: 'error.skill_error' }, HttpStatus.BAD_REQUEST);
    }

    return this.skillService.update(args);
  }

  @Mutation(() => Skill, { name: 'delete_skill' })
  @AuthRoles({ roles: [UserRole.admin, UserRole.super_admin] })
  delete(@Args() args: DeleteOneSkillArgs) {
    return this.skillService.delete(args);
  }

  @Query(() => AllSkillResult, { name: 'all_skill' })
  all(@Args(new TakeLimit()) args: AllSkillArgs) {
    return this.skillService.findMany(args);
  }

  @Query(() => Skill, { name: 'one_skill' })
  findOne(@Args() args: FindFirstSkillArgs) {
    return this.skillService.findFirst(args);
  }
}
