import { FindManyPostArgs, Post, PostCategory, PostCreateInput, Tag } from '@/prisma/graphql';
import { Metadata, PaginationInput } from '@/types';
import { ArgsType, Field, InputType, ObjectType, OmitType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { UserOnly } from '../user/user.type';

@ArgsType()
export class AllPostArgs extends FindManyPostArgs {
  @Field(() => PaginationInput, { nullable: true })
  pagination?: PaginationInput;

  @Field(() => String, { nullable: true })
  searchValue?: string;
}

@InputType()
export class CreatePostInput extends OmitType(PostCreateInput, ['author', 'slug', 'minRead']) {
  @Field(() => [String], { nullable: true, defaultValue: [] })
  thumbnailIds?: string[];
}

@ArgsType()
export class CreatePostArgs {
  @Field(() => CreatePostInput, { nullable: false })
  @Type(() => CreatePostInput)
  data!: InstanceType<typeof CreatePostInput>;
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
