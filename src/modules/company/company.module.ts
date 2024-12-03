import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyResolver } from './company.resolver';
import { PrismaModule } from '@/prisma/prisma.module';
import { FileModule } from '../file/file.module';

@Module({
  imports: [PrismaModule, FileModule],
  providers: [CompanyResolver, CompanyService],
  exports: [CompanyService]
})
export class CompanyModule {}
