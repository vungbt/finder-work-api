import { LikePost, PostCount } from '@/prisma/graphql';
import { Metadata } from '@/types';
import { ArgsType, Field, ObjectType, OmitType, registerEnumType } from '@nestjs/graphql';

@ArgsType()
export class CreateVoteArgs {
  @Field(() => String)
  postId: string;

  @Field(() => String, { nullable: true })
  commentId?: string;

  @Field(() => VoteAction)
  action: VoteAction;
}

export enum VoteAction {
  UP_VOTE = 1,
  DOWN_VOTE = -1
}

registerEnumType(VoteAction, {
  name: 'VoteAction', // this one is mandatory
  description: 'The roles of the user' // this one is optional
});

@ObjectType()
export class VoteItem extends LikePost {
  @Field(() => OmitType(PostCount, ['bookmarks', 'categories', 'comments', 'tags', 'thumbnails']), {
    nullable: true
  })
  _post_count?: number;
}

@ObjectType()
export class CreateVotePostResult {
  @Field(() => VoteItem)
  data: VoteItem;

  @Field(() => Metadata, { nullable: true })
  metadata?: Metadata;
}
