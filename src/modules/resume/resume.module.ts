import { UserService } from '@/modules/user/user.service';
import { Module } from '@nestjs/common';
import { ResumeService } from './resume.service';
import { ResumeResolver } from './resume.resolver';
import { PrismaModule } from '@/prisma/prisma.module';
import { FileModule } from '../file/file.module';
import { CompanyModule } from '../company/company.module';
import { PdfModule } from '../common/pdf/pdf.module';

@Module({
  imports: [PrismaModule, FileModule, CompanyModule, PdfModule],
  providers: [ResumeResolver, ResumeService, UserService],
  exports: [ResumeService]
})
export class ResumeModule {}
