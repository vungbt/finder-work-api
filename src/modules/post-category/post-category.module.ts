import { Module } from '@nestjs/common';
import { PostCategoryService } from './post-category.service';
import { PostCategoryResolver } from './post-category.resolver';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PostCategoryResolver, PostCategoryService],
  exports: [PostCategoryService]
})
export class PostCategoryModule {}
