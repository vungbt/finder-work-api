import { Test, TestingModule } from '@nestjs/testing';
import { JobCategoryResolver } from './job-category.resolver';
import { JobCategoryService } from './job-category.service';

describe('JobCategoryResolver', () => {
  let resolver: JobCategoryResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobCategoryResolver, JobCategoryService]
    }).compile();

    resolver = module.get<JobCategoryResolver>(JobCategoryResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
