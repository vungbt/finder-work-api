import {
  DeleteOnePostArgs,
  FindFirstPostArgs,
  JobCategory,
  PostCategory,
  PostCount,
  UpdateOnePostArgs
} from '@/prisma/graphql';
import { ContextType } from '@/types';
import { TakeLimit } from '@/utils/pipes/take-limit.decorator';
import { Args, Context, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UserRole } from '@prisma/client';
import { AuthRoles } from '../auth/passport/jwt/jwt.decorator';
import { IDataloaders } from '../common/dataloader/dataloader.type';
import { UserOnly } from '../user/user.type';
import { PostService } from './post.service';
import { AllPostArgs, AllPostResult, CreatePostArgs, PostItem, UserVote } from './post.type';
import { BookmarkPostService } from '../bookmark-post/bookmark-post.service';
import { VotePostService } from '../vote-post/vote-post.service';
import { VoteAction } from '../vote-post/vote-post.type';
import { merge } from 'lodash';
import { UserService } from '../user/user.service';
import { ReportPostService } from '../report-post/report-post.service';
import { CommentService } from '../comment/comment.service';

@Resolver(() => PostItem)
export class PostResolver {
  constructor(
    private readonly postService: PostService,
    private readonly bookmarkPostService: BookmarkPostService,
    private readonly votePostService: VotePostService,
    private readonly reportPostService: ReportPostService,
    private readonly commentService: CommentService,
    private readonly userService: UserService
  ) {}

  @Mutation(() => PostItem, { name: 'create_post' })
  @AuthRoles({ roles: [UserRole.admin, UserRole.super_admin] })
  create(@Args() args: CreatePostArgs, @Context() ctx: ContextType) {
    return this.postService.create(args, ctx.req.user);
  }

  @Mutation(() => PostItem, { name: 'update_post' })
  @AuthRoles({ roles: [UserRole.admin] })
  update(@Args() args: UpdateOnePostArgs) {
    return this.postService.update(args);
  }

  @Mutation(() => PostItem, { name: 'delete_post' })
  @AuthRoles({ roles: [UserRole.admin] })
  delete(@Args() args: DeleteOnePostArgs) {
    return this.postService.delete(args);
  }

  @Query(() => AllPostResult, { name: 'all_post' })
  @AuthRoles({ isOptional: true })
  all(@Args(new TakeLimit()) args: AllPostArgs) {
    return this.postService.findMany(args);
  }

  @Query(() => PostItem, { name: 'one_post' })
  @AuthRoles({ isOptional: true })
  findOne(@Args() args: FindFirstPostArgs) {
    return this.postService.findFirst(args);
  }

  @ResolveField(() => [PostCategory])
  categories(@Parent() post: PostItem, @Context() { loaders }: { loaders: IDataloaders }) {
    if (!post.categories || post.categories.length < 0) return [];
    const categoryIds = post.categories.map((item) => item.id);
    return loaders.postCategoryMany.load(categoryIds);
  }

  @ResolveField(() => JobCategory)
  jobCategory(@Parent() post: PostItem, @Context() { loaders }: { loaders: IDataloaders }) {
    if (!post.jobCategoryId) return null;
    return loaders.jobCategoryUnique.load(post.jobCategoryId);
  }

  @ResolveField(() => UserOnly)
  author(@Parent() post: PostItem, @Context() { loaders }: { loaders: IDataloaders }) {
    if (!post.authorId) return null;
    return loaders.userUnique.load(post.authorId);
  }

  @ResolveField(() => UserOnly)
  async userBookmark(@Parent() post: PostItem, @Context() { req, loaders }: ContextType) {
    const userId = req?.user?.id;
    const bookmarkValid = await this.bookmarkPostService.findFirst({
      where: { userId, postId: post.id }
    });
    if (!userId || !bookmarkValid) return null;
    return loaders.userUnique.load(userId);
  }

  @ResolveField(() => UserVote)
  async userVote(@Parent() post: PostItem, @Context() { req, loaders }: ContextType) {
    const userId = req?.user?.id;

    if (!userId || !req.user.id) return null;
    const likes = await this.votePostService.countLike({ where: { userId, postId: post.id } });
    const dislikes = await this.votePostService.countDislike({
      where: { userId, postId: post.id }
    });
    if (likes <= 0 && dislikes <= 0) return null;
    let action = null;
    if (likes > 0) {
      action = VoteAction.UP_VOTE;
    } else {
      action = VoteAction.DOWN_VOTE;
    }
    const result = merge(await loaders.userUnique.load(userId), { action });
    return result;
  }

  @ResolveField(() => PostCount)
  async _count(@Parent() post: PostItem) {
    if (!post.id) return null;
    const likes = this.votePostService.countLike({ where: { postId: post.id } });
    const dislikes = this.votePostService.countDislike({ where: { postId: post.id } });
    const comments = this.commentService.count({ where: { postId: post.id } });
    return {
      likes,
      dislikes,
      comments
    };
  }

  @ResolveField(() => UserOnly)
  async userReport(@Parent() post: PostItem, @Context() { req, loaders }: ContextType) {
    const userId = req?.user?.id;
    if (!post.id || !userId || !req.user.id) return null;

    const report = await this.reportPostService.findFirst({ where: { postId: post.id, userId } });
    if (!report || !report.id) return null;
    return loaders.userUnique.load(userId);
  }
}
