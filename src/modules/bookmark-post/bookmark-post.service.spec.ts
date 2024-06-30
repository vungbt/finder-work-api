import { Test, TestingModule } from '@nestjs/testing';
import { BookmarkPostService } from './bookmark-post.service';

describe('BookmarkPostService', () => {
  let service: BookmarkPostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookmarkPostService]
    }).compile();

    service = module.get<BookmarkPostService>(BookmarkPostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
