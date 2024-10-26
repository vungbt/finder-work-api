import { FindManySkillArgs, Skill } from '@/prisma/graphql';
import { Metadata, PaginationInput } from '@/types';
import { ArgsType, Field, ObjectType } from '@nestjs/graphql';

@ArgsType()
export class AllSkillArgs extends FindManySkillArgs {
  @Field(() => PaginationInput, { nullable: true })
  pagination?: PaginationInput;

  @Field(() => String, { nullable: true })
  searchValue?: string;
}

@ObjectType()
export class AllSkillResult {
  @Field(() => [Skill])
  data: Skill[];

  @Field(() => Metadata, { nullable: true })
  metadata?: Metadata;
}
