import {
  CreateOneSkillArgs,
  DeleteOneSkillArgs,
  FindFirstSkillArgs,
  FindManySkillArgs,
  Skill,
  UpdateOneSkillArgs
} from '@/prisma/graphql';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SkillService } from './skill.service';

@Resolver(() => Skill)
export class SkillResolver {
  constructor(private readonly skillService: SkillService) {}
  @Mutation(() => Skill, { name: 'create_skill' })
  create(@Args() args: CreateOneSkillArgs) {
    return this.skillService.create(args);
  }

  @Mutation(() => Skill, { name: 'update_skill' })
  update(@Args() args: UpdateOneSkillArgs) {
    return this.skillService.update(args);
  }

  @Mutation(() => Skill, { name: 'delete_skill' })
  delete(@Args() args: DeleteOneSkillArgs) {
    return this.skillService.delete(args);
  }

  @Query(() => [Skill], { name: 'all_skill' })
  all(@Args() args: FindManySkillArgs) {
    return this.skillService.findMany(args);
  }

  @Query(() => Skill, { name: 'one_skill' })
  findOne(@Args() args: FindFirstSkillArgs) {
    return this.skillService.findFirst(args);
  }
}
