import { Test, TestingModule } from '@nestjs/testing';
import { LanguageSkillResolver } from './language-skill.resolver';
import { LanguageSkillService } from './language-skill.service';

describe('LanguageSkillResolver', () => {
  let resolver: LanguageSkillResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LanguageSkillResolver, LanguageSkillService]
    }).compile();

    resolver = module.get<LanguageSkillResolver>(LanguageSkillResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
