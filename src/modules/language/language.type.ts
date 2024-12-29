import { FindManyLanguageArgs, Language } from './../../prisma/graphql/index';
import { Metadata, PaginationInput } from '@/types';
import { ArgsType, Field, ObjectType } from '@nestjs/graphql';

@ArgsType()
export class AllLanguageArgs extends FindManyLanguageArgs {
  @Field(() => String, { nullable: true })
  searchValue?: string;

  @Field(() => PaginationInput, { nullable: true })
  pagination?: PaginationInput;
}

@ObjectType()
export class AllLanguageResult {
  @Field(() => [Language], { defaultValue: [] })
  data: Language[];

  @Field(() => Metadata, { nullable: true })
  metadata?: Metadata;
}
