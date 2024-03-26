import { Module } from '@nestjs/common';
import { CompanyTypeService } from './company-type.service';
import { CompanyTypeResolver } from './company-type.resolver';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [CompanyTypeResolver, CompanyTypeService],
  exports: [CompanyTypeService]
})
export class CompanyTypeModule {}
