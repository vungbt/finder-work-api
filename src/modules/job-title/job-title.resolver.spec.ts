import { Test, TestingModule } from '@nestjs/testing';
import { JobTitleResolver } from './job-title.resolver';
import { JobTitleService } from './job-title.service';

describe('JobTitleResolver', () => {
  let resolver: JobTitleResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobTitleResolver, JobTitleService]
    }).compile();

    resolver = module.get<JobTitleResolver>(JobTitleResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
