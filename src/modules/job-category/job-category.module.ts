import { Module } from '@nestjs/common';
import { JobCategoryService } from './job-category.service';
import { JobCategoryResolver } from './job-category.resolver';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  exports: [JobCategoryService],
  providers: [JobCategoryResolver, JobCategoryService]
})
export class JobCategoryModule {}
