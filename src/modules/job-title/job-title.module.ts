import { Module } from '@nestjs/common';
import { JobTitleService } from './job-title.service';
import { JobTitleResolver } from './job-title.resolver';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  exports: [JobTitleService],
  providers: [JobTitleResolver, JobTitleService]
})
export class JobTitleModule {}
