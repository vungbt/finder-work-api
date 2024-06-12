import { pubSub } from '@/app.module';
import { ContextType } from '@/types';
import {
  Args,
  Context,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
  Subscription
} from '@nestjs/graphql';
import { AuthRoles } from '../auth/passport/jwt/jwt.decorator';
import { VotePostService } from './vote-post.service';
import { CreateVoteArgs, CreateVotePostResult, VoteItem, VotePostCount } from './vote-post.type';

@Resolver(() => VoteItem)
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

  @ResolveField(() => VotePostCount)
  async _postCount(@Parent() votePost: VoteItem) {
    const { postId } = votePost;
    if (!postId) return null;
    const likesCount = await this.votePostService.countLike({ where: { postId, commentId: null } });
    const dislikeCount = await this.votePostService.countDislike({
      where: { postId, commentId: null }
    });
    return {
      likes: likesCount,
      dislikes: dislikeCount
    };
  }
}
