import { Module } from '@nestjs/common';
import { BookmarkPostService } from './bookmark-post.service';
import { BookmarkPostResolver } from './bookmark-post.resolver';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [BookmarkPostResolver, BookmarkPostService],
  exports: [BookmarkPostService]
})
export class BookmarkPostModule {}
