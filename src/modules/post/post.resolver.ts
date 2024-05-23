import {
  DeleteOnePostArgs,
  FindFirstPostArgs,
  JobCategory,
  Post,
  PostCategory,
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
import { AllPostArgs, AllPostResult, CreatePostArgs } from './post.type';

@Resolver(() => Post)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @Mutation(() => Post, { name: 'create_post' })
  @AuthRoles({ roles: [UserRole.admin, UserRole.super_admin] })
  create(@Args() args: CreatePostArgs, @Context() ctx: ContextType) {
    return this.postService.create(args, ctx.req.user);
  }

  @Mutation(() => Post, { name: 'update_post' })
  @AuthRoles({ roles: [UserRole.admin] })
  update(@Args() args: UpdateOnePostArgs) {
    return this.postService.update(args);
  }

  @Mutation(() => Post, { name: 'delete_post' })
  @AuthRoles({ roles: [UserRole.admin] })
  delete(@Args() args: DeleteOnePostArgs) {
    return this.postService.delete(args);
  }

  @Query(() => AllPostResult, { name: 'all_post' })
  all(@Args(new TakeLimit()) args: AllPostArgs) {
    return this.postService.findMany(args);
  }

  @Query(() => Post, { name: 'one_post' })
  findOne(@Args() args: FindFirstPostArgs) {
    return this.postService.findFirst(args);
  }

  @ResolveField(() => [PostCategory])
  categories(@Parent() post: Post, @Context() { loaders }: { loaders: IDataloaders }) {
    if (!post.categories || post.categories.length < 0) return null;
    const categoryIds = post.categories.map((item) => item.id);
    return loaders.postCategoryMany.load(categoryIds);
  }

  @ResolveField(() => JobCategory)
  jobCategory(@Parent() post: Post, @Context() { loaders }: { loaders: IDataloaders }) {
    if (!post.jobCategoryId) return null;
    return loaders.jobCategoryUnique.load(post.jobCategoryId);
  }

  @ResolveField(() => UserOnly)
  author(@Parent() post: Post, @Context() { loaders }: { loaders: IDataloaders }) {
    if (!post.authorId) return null;
    return loaders.userUnique.load(post.authorId);
  }
}
