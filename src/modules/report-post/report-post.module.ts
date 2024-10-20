import { Module } from '@nestjs/common';
import { ReportPostService } from './report-post.service';
import { ReportPostResolver } from './report-post.resolver';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ReportPostResolver, ReportPostService],
  exports: [ReportPostService]
})
export class ReportPostModule {}
