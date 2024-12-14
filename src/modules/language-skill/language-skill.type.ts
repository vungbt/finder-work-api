import { FindManyLanguageSkillArgs, LanguageSkill } from '@/prisma/graphql';
import { Metadata, PaginationInput } from '@/types';
import { ArgsType, Field, ObjectType } from '@nestjs/graphql';

@ArgsType()
export class AllLanguageSkillArgs extends FindManyLanguageSkillArgs {
  @Field(() => String, { nullable: true })
  searchValue?: string;

  @Field(() => PaginationInput, { nullable: true })
  pagination?: PaginationInput;
}

@ObjectType()
export class AllLanguageSkillResult {
  @Field(() => [LanguageSkill], { defaultValue: [] })
  data: LanguageSkill[];

  @Field(() => Metadata, { nullable: true })
  metadata?: Metadata;
}
