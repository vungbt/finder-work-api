import { PrismaService } from '@/prisma/prisma.service';
import { CurrentUser } from '@/types';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateVoteArgs, CreateVotePostResult, VoteAction } from './vote-post.type';
import { responseHelper } from '@/utils/helpers';

@Injectable()
export class VotePostService {
  constructor(private readonly prismaService: PrismaService) {}

  async votePost(args: CreateVoteArgs, user: CurrentUser): Promise<CreateVotePostResult> {
    const userId = user.id;
    const { action, postId, commentId } = args;

    const voteModel: any =
      action === VoteAction.DOWN_VOTE
        ? this.prismaService.dislikePost
        : this.prismaService.likePost;

    let votePost = await voteModel.findFirst({
      where: { userId, postId, commentId }
    });

    await this.prismaService.dislikePost.deleteMany({ where: { userId, postId, commentId } });
    await this.prismaService.likePost.deleteMany({ where: { userId, postId, commentId } });

    let status = 'deleted';
    if (!votePost) {
      const data = {
        user: { connect: { id: userId } },
        post: { connect: { id: postId } },
        ...(commentId && { comment: { connect: { id: commentId } } })
      };

      votePost = await voteModel.create({ data });
      status = 'created';
    }

    return responseHelper(votePost, { status, action });
  }

  countLike(args: Prisma.LikePostCountArgs) {
    return this.prismaService.likePost.count(args);
  }

  countDislike(args: Prisma.DislikePostCountArgs) {
    return this.prismaService.dislikePost.count(args);
  }
}
