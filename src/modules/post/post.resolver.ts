import {
  CreateOnePostArgs,
  DeleteOnePostArgs,
  FindFirstPostArgs,
  JobTitle,
  Post,
  PostCategory,
  Tag,
  UpdateOnePostArgs
} from '@/prisma/graphql';
import { TakeLimit } from '@/utils/pipes/take-limit.decorator';
import { Args, Context, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UserRole } from '@prisma/client';
import { AuthRoles } from '../auth/passport/jwt/jwt.decorator';
import { IDataloaders } from '../common/dataloader/dataloader.type';
import { UserOnly } from '../user/user.type';
import { PostService } from './post.service';
import { AllPostArgs, AllPostResult } from './post.type';

@Resolver(() => Post)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @Mutation(() => Post, { name: 'create_post' })
  // @AuthRoles({ roles: [UserRole.admin] })
  create(@Args() args: CreateOnePostArgs) {
    return this.postService.create(args);
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

  @ResolveField(() => [Tag])
  tags(@Parent() post: Post, @Context() { loaders }: { loaders: IDataloaders }) {
    if (!post.tags || post.tags.length < 0) return null;
    const tagIds = post.tags.map((item) => item.id);
    return loaders.tagMany.load(tagIds);
  }

  @ResolveField(() => [PostCategory])
  categories(@Parent() post: Post, @Context() { loaders }: { loaders: IDataloaders }) {
    if (!post.categories || post.categories.length < 0) return null;
    const categoryIds = post.categories.map((item) => item.id);
    return loaders.postCategoryMany.load(categoryIds);
  }

  @ResolveField(() => JobTitle)
  jobTitle(@Parent() post: Post, @Context() { loaders }: { loaders: IDataloaders }) {
    if (!post.jobTitleId) return null;
    return loaders.jobTitleUnique.load(post.jobTitleId);
  }

  @ResolveField(() => UserOnly)
  author(@Parent() post: Post, @Context() { loaders }: { loaders: IDataloaders }) {
    if (!post.jobTitleId) return null;
    return loaders.userUnique.load(post.authorId);
  }
}
