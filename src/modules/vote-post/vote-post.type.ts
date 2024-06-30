import { LikePost } from '@/prisma/graphql';
import { Metadata } from '@/types';
import { ArgsType, Field, ObjectType, registerEnumType } from '@nestjs/graphql';

@ArgsType()
export class CreateVoteArgs {
  @Field(() => String)
  postId: string;

  @Field(() => String, { nullable: true })
  commentId?: string;

  @Field(() => VoteAction)
  action: VoteAction;
}

@ArgsType()
export class FindManyVoteArgs {
  @Field(() => String)
  postId?: string;

  @Field(() => String, { nullable: true })
  commentId?: string;
}

export enum VoteAction {
  UP_VOTE = 'UP_VOTE',
  DOWN_VOTE = 'DOWN_VOTE'
}

registerEnumType(VoteAction, {
  name: 'VoteAction', // this one is mandatory
  description: 'The roles of the user' // this one is optional
});

@ObjectType()
export class VotePostCount {
  @Field(() => Number, { nullable: false })
  likes?: number;
  @Field(() => Number, { nullable: false })
  dislikes?: number;
}

@ObjectType()
export class VoteItem extends LikePost {
  @Field(() => VotePostCount, { nullable: true })
  _postCount: VotePostCount;
}

@ObjectType()
export class CreateVotePostResult {
  @Field(() => VoteItem)
  data: VoteItem;

  @Field(() => Metadata, { nullable: true })
  metadata?: Metadata;
}
