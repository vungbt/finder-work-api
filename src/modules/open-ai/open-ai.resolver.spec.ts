import { Test, TestingModule } from '@nestjs/testing';
import { OpenAiResolver } from './open-ai.resolver';
import { OpenAiService } from './open-ai.service';

describe('OpenAiResolver', () => {
  let resolver: OpenAiResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OpenAiResolver, OpenAiService]
    }).compile();

    resolver = module.get<OpenAiResolver>(OpenAiResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
