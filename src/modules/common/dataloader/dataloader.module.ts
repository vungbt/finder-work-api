import { Module } from '@nestjs/common';
import { DataloaderService } from './dataloader.service';
import { FileModule } from '../../file/file.module';
import { AddressModule } from '@/modules/address/address.module';
import { TagModule } from '@/modules/tag/tag.module';
import { PostCategoryModule } from '@/modules/post-category/post-category.module';
import { JobTitleModule } from '@/modules/job-title/job-title.module';
import { UserModule } from '@/modules/user/user.module';

@Module({
  imports: [FileModule, AddressModule, TagModule, PostCategoryModule, JobTitleModule, UserModule],
  providers: [DataloaderService],
  exports: [DataloaderService]
})
export class DataloaderModule {}
