import { FindManyPostArgs, Post, PostCategory, Tag } from '@/prisma/graphql';
import { Metadata, PaginationInput } from '@/types';
import { ArgsType, Field, ObjectType, OmitType } from '@nestjs/graphql';
import { UserOnly } from '../user/user.type';

@ArgsType()
export class AllPostArgs extends FindManyPostArgs {
  @Field(() => PaginationInput, { nullable: true })
  pagination?: PaginationInput;
}

@ObjectType()
export class AllPostResult {
  @Field(() => [Post])
  data: Post[];

  @Field(() => Metadata, { nullable: true })
  metadata?: Metadata;
}

@ObjectType()
export class PostItem extends OmitType(Post, ['categories', 'tags', 'author']) {
  @Field(() => UserOnly, { defaultValue: null })
  author: UserOnly;

  @Field(() => [PostCategory], { defaultValue: [] })
  categories: PostCategory[];

  @Field(() => [Tag], { defaultValue: [] })
  tags: Tag[];
}
