import { BookmarkPost, FindManyBookmarkPostArgs } from '@/prisma/graphql';
import { Metadata, PaginationInput } from '@/types';
import { ArgsType, Field, ObjectType } from '@nestjs/graphql';

@ArgsType()
export class AllBookmarkPostArgs extends FindManyBookmarkPostArgs {
  @Field(() => PaginationInput, { nullable: true })
  pagination?: PaginationInput;

  @Field(() => String, { nullable: true })
  searchValue?: string;
}

@ObjectType()
export class AllBookmarkPostResult {
  @Field(() => [BookmarkPost])
  data: BookmarkPost[];

  @Field(() => Metadata, { nullable: true })
  metadata?: Metadata;
}

@ArgsType()
export class BookmarkPostArgs {
  @Field(() => String)
  postId: string;
}

@ObjectType()
export class BookmarkPostResult {
  @Field(() => BookmarkPost)
  data: BookmarkPost;

  @Field(() => Metadata, { nullable: true })
  metadata?: Metadata;
}
