import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostResolver } from './post.resolver';
import { PrismaModule } from '@/prisma/prisma.module';
import { FileModule } from '../file/file.module';

@Module({
  imports: [PrismaModule, FileModule],
  providers: [PostResolver, PostService],
  exports: [PostService]
})
export class PostModule {}
