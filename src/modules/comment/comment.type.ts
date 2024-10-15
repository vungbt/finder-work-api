import { Comment, CommentCreateInput, FindManyCommentArgs } from '@/prisma/graphql';
import { Metadata, PaginationInput } from '@/types';
import { ArgsType, Field, InputType, ObjectType, OmitType } from '@nestjs/graphql';
import { Type } from 'class-transformer';

@ArgsType()
export class AllCommentArgs extends FindManyCommentArgs {
  @Field(() => String, { nullable: true })
  searchValue?: string;

  @Field(() => PaginationInput, { nullable: true })
  pagination?: PaginationInput;
}

@ObjectType()
export class AllCommentResult {
  @Field(() => [CommentItem])
  data: CommentItem[];

  @Field(() => Metadata, { nullable: true })
  metadata?: Metadata;
}

@InputType()
export class CreateCommentInput extends OmitType(CommentCreateInput, ['post', 'user', 'parent']) {
  @Field(() => String, { nullable: false })
  postId: string;

  @Field(() => String, { nullable: true })
  parentId?: string;
}

@ArgsType()
export class CreateCommentArgs {
  @Field(() => CreateCommentInput, { nullable: false })
  @Type(() => CreateCommentInput)
  data!: InstanceType<typeof CreateCommentInput>;
}

@ObjectType()
export class CommentItem extends Comment {
  @Field(() => Number, { defaultValue: 0 })
  totalReplies: number;
}
