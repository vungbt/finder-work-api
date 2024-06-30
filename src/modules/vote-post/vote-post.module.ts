import { Module } from '@nestjs/common';
import { VotePostService } from './vote-post.service';
import { VotePostResolver } from './vote-post.resolver';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [VotePostResolver, VotePostService],
  exports: [VotePostService]
})
export class VotePostModule {}
