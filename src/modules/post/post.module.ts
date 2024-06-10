import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostResolver } from './post.resolver';
import { PrismaModule } from '@/prisma/prisma.module';
import { FileModule } from '../file/file.module';
import { BookmarkPostModule } from '../bookmark-post/bookmark-post.module';
import { VotePostModule } from '../vote-post/vote-post.module';

@Module({
  imports: [PrismaModule, FileModule, BookmarkPostModule, VotePostModule],
  providers: [PostResolver, PostService],
  exports: [PostService]
})
export class PostModule {}
