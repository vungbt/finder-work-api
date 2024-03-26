import { Test, TestingModule } from '@nestjs/testing';
import { CompanySizeResolver } from './company-size.resolver';
import { CompanySizeService } from './company-size.service';

describe('CompanySizeResolver', () => {
  let resolver: CompanySizeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompanySizeResolver, CompanySizeService]
    }).compile();

    resolver = module.get<CompanySizeResolver>(CompanySizeResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
