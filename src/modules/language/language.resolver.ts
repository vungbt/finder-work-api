import { Language } from '@/prisma/graphql';
import { TakeLimit } from '@/utils/pipes/take-limit.decorator';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { LanguageService } from './language.service';
import { AllLanguageArgs, AllLanguageResult } from './language.type';

@Resolver(() => Language)
export class LanguageResolver {
  constructor(private readonly languageService: LanguageService) {}

  @Query(() => AllLanguageResult, { name: 'all_language' })
  all(@Args(new TakeLimit()) args: AllLanguageArgs) {
    return this.languageService.findMany(args);
  }
}
