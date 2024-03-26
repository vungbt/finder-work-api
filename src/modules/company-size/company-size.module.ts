import { Module } from '@nestjs/common';
import { CompanySizeService } from './company-size.service';
import { CompanySizeResolver } from './company-size.resolver';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [CompanySizeResolver, CompanySizeService],
  exports: [CompanySizeService]
})
export class CompanySizeModule {}
