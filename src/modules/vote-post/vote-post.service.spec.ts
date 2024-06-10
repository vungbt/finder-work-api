import { Test, TestingModule } from '@nestjs/testing';
import { VotePostService } from './vote-post.service';

describe('VotePostService', () => {
  let service: VotePostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VotePostService]
    }).compile();

    service = module.get<VotePostService>(VotePostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
