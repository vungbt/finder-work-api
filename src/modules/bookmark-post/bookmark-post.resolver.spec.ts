import { Test, TestingModule } from '@nestjs/testing';
import { BookmarkPostResolver } from './bookmark-post.resolver';
import { BookmarkPostService } from './bookmark-post.service';

describe('BookmarkPostResolver', () => {
  let resolver: BookmarkPostResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookmarkPostResolver, BookmarkPostService]
    }).compile();

    resolver = module.get<BookmarkPostResolver>(BookmarkPostResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
