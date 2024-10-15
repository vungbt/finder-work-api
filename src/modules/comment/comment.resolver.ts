import { pubSub } from '@/app.module';
import { DeleteOneCommentArgs, FindFirstCommentArgs, UpdateOneCommentArgs } from '@/prisma/graphql';
import { ContextType } from '@/types';
import { TakeLimit } from '@/utils/pipes/take-limit.decorator';
import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription
} from '@nestjs/graphql';
import { AuthRoles } from '../auth/passport/jwt/jwt.decorator';
import { PostItem } from '../post/post.type';
import { UserOnly } from '../user/user.type';
import { CommentService } from './comment.service';
import { AllCommentArgs, AllCommentResult, CommentItem, CreateCommentArgs } from './comment.type';

@Resolver(() => CommentItem)
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}

  @Mutation(() => CommentItem, { name: 'create_comment' })
  @AuthRoles()
  create(@Args() args: CreateCommentArgs, @Context() ctx: ContextType) {
    const userId = ctx?.req?.user?.id;
    const comment = this.commentService.create(args, userId);
    pubSub.publish('post_comment', { post_comment: comment });
    return comment;
  }

  @Subscription(() => CommentItem, { name: 'post_comment' })
  postComment() {
    return pubSub.asyncIterator('post_comment');
  }

  @Mutation(() => CommentItem, { name: 'update_comment' })
  @AuthRoles()
  update(@Args() args: UpdateOneCommentArgs) {
    return this.commentService.update(args);
  }

  @Mutation(() => CommentItem, { name: 'delete_comment' })
  @AuthRoles()
  delete(@Args() args: DeleteOneCommentArgs) {
    return this.commentService.delete(args);
  }

  @Query(() => AllCommentResult, { name: 'all_comment' })
  @AuthRoles()
  all(@Args(new TakeLimit(10)) args: AllCommentArgs) {
    return this.commentService.findMany(args);
  }

  @Query(() => CommentItem, { name: 'one_comment' })
  @AuthRoles()
  findOne(@Args() args: FindFirstCommentArgs) {
    return this.commentService.findFirst(args);
  }

  @ResolveField(() => UserOnly)
  async user(@Parent() comment: CommentItem, @Context() ctx: ContextType) {
    if (!comment.id || !comment || !comment.userId) return null;
    const loaders = ctx.loaders;
    const result = await this.commentService.findFirst({
      where: { id: comment.id, userId: comment.userId },
      select: { id: true }
    });
    if (!result || !result.id) return null;
    return loaders.userUnique.load(comment.userId);
  }

  @ResolveField(() => PostItem)
  async post(@Parent() comment: CommentItem, @Context() { loaders }: ContextType) {
    if (!comment.id || !comment || !comment.postId) return null;

    const result = await this.commentService.findFirst({
      where: { id: comment.id, postId: comment.postId },
      select: { id: true }
    });
    if (!result || !result.id) return null;
    return loaders.postUnique.load(comment.postId);
  }

  @ResolveField(() => [CommentItem])
  async replies(@Parent() comment: CommentItem) {
    if (!comment.id || !comment) return null;

    const result = await this.commentService.findAll({
      where: { parentId: { equals: comment.id } }
    });
    if (!result || result.length <= 0) return [];
    return result;
  }

  @ResolveField(() => [Number])
  async totalReplies(@Parent() comment: CommentItem) {
    if (!comment.id || !comment) return null;

    const result = await this.commentService.count({
      where: { parentId: { equals: comment.id } }
    });
    return result;
  }

  @ResolveField(() => [CommentItem])
  async parent(@Parent() comment: CommentItem, @Context() { loaders }: ContextType) {
    if (!comment.id || !comment || !comment.parentId) return null;

    const result = await this.commentService.findFirst({
      where: { id: comment.parentId },
      select: { id: true }
    });
    if (!result || !result.id) return null;
    return loaders.commentUnique.load(comment.parentId);
  }
}
