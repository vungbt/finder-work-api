import {
  CreateOnePostArgs,
  DeleteOnePostArgs,
  FindFirstPostArgs,
  FindManyPostArgs,
  Post,
  UpdateOnePostArgs
} from '@/prisma/graphql';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PostService } from './post.service';

@Resolver(() => Post)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @Mutation(() => Post, { name: 'create_post' })
  create(@Args() args: CreateOnePostArgs) {
    return this.postService.create(args);
  }

  @Mutation(() => Post, { name: 'update_post' })
  update(@Args() args: UpdateOnePostArgs) {
    return this.postService.update(args);
  }

  @Mutation(() => Post, { name: 'delete_post' })
  delete(@Args() args: DeleteOnePostArgs) {
    return this.postService.delete(args);
  }

  @Query(() => [Post], { name: 'all_post' })
  all(@Args() args: FindManyPostArgs) {
    return this.postService.findMany(args);
  }

  @Query(() => Post, { name: 'one_post' })
  findOne(@Args() args: FindFirstPostArgs) {
    return this.postService.findFirst(args);
  }
}
