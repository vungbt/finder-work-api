import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobResolver } from './job.resolver';
import { PrismaModule } from '@/prisma/prisma.module';
import { JobTitleService } from '../job-title/job-title.service';

@Module({
  imports: [PrismaModule],
  providers: [JobResolver, JobService, JobTitleService],
  exports: [JobService]
})
export class JobModule {}
