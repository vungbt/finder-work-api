import {
  CreateOneCommentArgs,
  DeleteOneCommentArgs,
  FindFirstCommentArgs,
  FindManyCommentArgs,
  Comment,
  UpdateOneCommentArgs
} from '@/prisma/graphql';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CommentService } from './comment.service';
import { AuthRoles } from '../auth/passport/jwt/jwt.decorator';

@Resolver(() => Comment)
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}

  @Mutation(() => Comment, { name: 'create_comment' })
  @AuthRoles()
  create(@Args() args: CreateOneCommentArgs) {
    return this.commentService.create(args);
  }

  @Mutation(() => Comment, { name: 'update_comment' })
  @AuthRoles()
  update(@Args() args: UpdateOneCommentArgs) {
    return this.commentService.update(args);
  }

  @Mutation(() => Comment, { name: 'delete_comment' })
  @AuthRoles()
  delete(@Args() args: DeleteOneCommentArgs) {
    return this.commentService.delete(args);
  }

  @Query(() => [Comment], { name: 'all_comment' })
  @AuthRoles()
  all(@Args() args: FindManyCommentArgs) {
    return this.commentService.findMany(args);
  }

  @Query(() => Comment, { name: 'one_comment' })
  @AuthRoles()
  findOne(@Args() args: FindFirstCommentArgs) {
    return this.commentService.findFirst(args);
  }
}
