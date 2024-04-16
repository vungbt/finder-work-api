import {
  CreateOnePostCategoryArgs,
  DeleteOnePostCategoryArgs,
  FindFirstPostCategoryArgs,
  PostCategory,
  UpdateOnePostCategoryArgs
} from '@/prisma/graphql';
import { TakeLimit } from '@/utils/pipes/take-limit.decorator';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserRole } from '@prisma/client';
import { AuthRoles } from '../auth/passport/jwt/jwt.decorator';
import { PostCategoryService } from './post-category.service';
import { AllPostCategoryArgs, AllPostCategoryResult } from './post-category.type';

@Resolver(() => PostCategory)
export class PostCategoryResolver {
  constructor(private readonly postCategoryService: PostCategoryService) {}

  @Mutation(() => PostCategory, { name: 'create_post_category' })
  @AuthRoles({ roles: [UserRole.admin] })
  create(@Args() args: CreateOnePostCategoryArgs) {
    return this.postCategoryService.create(args);
  }

  @Mutation(() => PostCategory, { name: 'update_post_category' })
  @AuthRoles({ roles: [UserRole.admin] })
  update(@Args() args: UpdateOnePostCategoryArgs) {
    return this.postCategoryService.update(args);
  }

  @Mutation(() => PostCategory, { name: 'delete_post_category' })
  @AuthRoles({ roles: [UserRole.admin] })
  delete(@Args() args: DeleteOnePostCategoryArgs) {
    return this.postCategoryService.delete(args);
  }

  @Query(() => AllPostCategoryResult, { name: 'all_post_category' })
  @AuthRoles({ roles: [UserRole.admin] })
  all(@Args(new TakeLimit()) args: AllPostCategoryArgs) {
    return this.postCategoryService.findAll(args);
  }

  @Query(() => PostCategory, { name: 'one_post_category' })
  findOne(@Args() args: FindFirstPostCategoryArgs) {
    return this.postCategoryService.findFirst(args);
  }
}
