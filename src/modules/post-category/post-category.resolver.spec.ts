import { Test, TestingModule } from '@nestjs/testing';
import { PostCategoryResolver } from './post-category.resolver';
import { PostCategoryService } from './post-category.service';

describe('PostCategoryResolver', () => {
  let resolver: PostCategoryResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostCategoryResolver, PostCategoryService]
    }).compile();

    resolver = module.get<PostCategoryResolver>(PostCategoryResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
