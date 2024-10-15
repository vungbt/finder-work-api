import { AddressModule } from '@/modules/address/address.module';
import { JobTitleModule } from '@/modules/job-title/job-title.module';
import { PostCategoryModule } from '@/modules/post-category/post-category.module';
import { SettingModule } from '@/modules/setting/setting.module';
import { TagModule } from '@/modules/tag/tag.module';
import { UserModule } from '@/modules/user/user.module';
import { Module } from '@nestjs/common';
import { FileModule } from '../../file/file.module';
import { DataloaderService } from './dataloader.service';
import { JobCategoryModule } from '@/modules/job-category/job-category.module';
import { PostModule } from '@/modules/post/post.module';
import { CommentModule } from '@/modules/comment/comment.module';

@Module({
  imports: [
    FileModule,
    AddressModule,
    TagModule,
    PostCategoryModule,
    JobTitleModule,
    JobCategoryModule,
    UserModule,
    SettingModule,
    PostModule,
    CommentModule
  ],
  providers: [DataloaderService],
  exports: [DataloaderService]
})
export class DataloaderModule {}
