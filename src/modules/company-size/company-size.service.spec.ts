import { Test, TestingModule } from '@nestjs/testing';
import { CompanySizeService } from './company-size.service';

describe('CompanySizeService', () => {
  let service: CompanySizeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompanySizeService]
    }).compile();

    service = module.get<CompanySizeService>(CompanySizeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
