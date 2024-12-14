import { LanguageSkill } from '@/prisma/graphql';
import { TakeLimit } from '@/utils/pipes/take-limit.decorator';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { LanguageSkillService } from './language-skill.service';
import { AllLanguageSkillArgs, AllLanguageSkillResult } from './language-skill.type';

@Resolver(() => LanguageSkill)
export class LanguageSkillResolver {
  constructor(private readonly languageSkillService: LanguageSkillService) {}

  @Query(() => AllLanguageSkillResult, { name: 'all_language_skill' })
  all(@Args(new TakeLimit()) args: AllLanguageSkillArgs) {
    return this.languageSkillService.findMany(args);
  }
}
