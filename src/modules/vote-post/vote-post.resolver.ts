import { LikePost } from '@/prisma/graphql';
import { ContextType } from '@/types';
import { Args, Context, Mutation, Resolver, Subscription } from '@nestjs/graphql';
import { AuthRoles } from '../auth/passport/jwt/jwt.decorator';
import { VotePostService } from './vote-post.service';
import { CreateVoteArgs, CreateVotePostResult } from './vote-post.type';
import { pubSub } from '@/app.module';

@Resolver(() => LikePost)
export class VotePostResolver {
  constructor(private readonly votePostService: VotePostService) {}

  @Mutation(() => CreateVotePostResult, { name: 'vote_post' })
  @AuthRoles()
  async create(@Args() args: CreateVoteArgs, @Context() ctx: ContextType) {
    const votePost = await this.votePostService.votePost(args, ctx.req.user);
    pubSub.publish('vote_post', { vote_post: votePost });
    return votePost;
  }

  @Subscription(() => CreateVotePostResult, { name: 'vote_post' })
  postUpvote() {
    return pubSub.asyncIterator('vote_post');
  }
}
