import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { CompanySizeModule } from '../company-size/company-size.module';
import { CompanyTypeModule } from '../company-type/company-type.module';
import { FileModule } from '../file/file.module';
import { JobCategoryModule } from '../job-category/job-category.module';
import { StorageModule } from '../storage/storage.module';
import { TestResolver } from './test.resolver';
import { TestService } from './test.service';
import { CloudinaryModule } from '../storage/cloudinary/cloudinary.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    PrismaModule,
    CompanySizeModule,
    CompanyTypeModule,
    JobCategoryModule,
    FileModule,
    StorageModule,
    CloudinaryModule
  ],
  providers: [TestResolver, TestService],
  exports: [TestService]
})
export class TestModule {}
