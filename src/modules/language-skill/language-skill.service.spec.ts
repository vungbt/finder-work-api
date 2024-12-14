import { Test, TestingModule } from '@nestjs/testing';
import { LanguageSkillService } from './language-skill.service';

describe('LanguageSkillService', () => {
  let service: LanguageSkillService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LanguageSkillService]
    }).compile();

    service = module.get<LanguageSkillService>(LanguageSkillService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
