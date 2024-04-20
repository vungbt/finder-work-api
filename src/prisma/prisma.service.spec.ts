import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          cache: true,
          expandVariables: true
        })
      ],
      providers: [PrismaService]
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
