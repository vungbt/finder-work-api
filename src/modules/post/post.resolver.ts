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
import { AllPostArgs, AllPostResult, CreatePostArgs, PostItem } from './post.type';
import { BookmarkPostService } from '../bookmark-post/bookmark-post.service';
import { VotePostService } from '../vote-post/vote-post.service';

@Resolver(() => PostItem)
export class PostResolver {
  constructor(
    private readonly postService: PostService,
    private readonly bookmarkPostService: BookmarkPostService,
    private readonly votePostService: VotePostService
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

  @ResolveField(() => PostCount)
  async _count(@Parent() post: PostItem) {
    if (!post.id) return null;
    const likes = this.votePostService.countLike({ where: { postId: post.id } });
    const dislikes = this.votePostService.countDislike({ where: { postId: post.id } });
    return {
      likes: likes,
      dislikes: dislikes,
      comments: 0 // TODO: Implement count comments
    };
  }
}
