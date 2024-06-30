import { Test, TestingModule } from '@nestjs/testing';
import { VotePostResolver } from './vote-post.resolver';
import { VotePostService } from './vote-post.service';

describe('VotePostResolver', () => {
  let resolver: VotePostResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VotePostResolver, VotePostService]
    }).compile();

    resolver = module.get<VotePostResolver>(VotePostResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
