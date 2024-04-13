import {
  CreateOnePostCategoryArgs,
  DeleteOnePostCategoryArgs,
  FindFirstPostCategoryArgs,
  FindManyPostCategoryArgs,
  PostCategory,
  UpdateOnePostCategoryArgs
} from '@/prisma/graphql';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PostCategoryService } from './post-category.service';

@Resolver(() => PostCategory)
export class PostCategoryResolver {
  constructor(private readonly postCategoryService: PostCategoryService) {}

  @Mutation(() => PostCategory, { name: 'create_post_category' })
  create(@Args() args: CreateOnePostCategoryArgs) {
    return this.postCategoryService.create(args);
  }

  @Mutation(() => PostCategory, { name: 'update_post_category' })
  update(@Args() args: UpdateOnePostCategoryArgs) {
    return this.postCategoryService.update(args);
  }

  @Mutation(() => PostCategory, { name: 'delete_post_category' })
  delete(@Args() args: DeleteOnePostCategoryArgs) {
    return this.postCategoryService.delete(args);
  }

  @Query(() => [PostCategory], { name: 'all_post_category' })
  all(@Args() args: FindManyPostCategoryArgs) {
    return this.postCategoryService.findMany(args);
  }

  @Query(() => PostCategory, { name: 'one_post_category' })
  findOne(@Args() args: FindFirstPostCategoryArgs) {
    return this.postCategoryService.findFirst(args);
  }
}
