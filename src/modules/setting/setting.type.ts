import { FindManySettingArgs, Setting } from '@/prisma/graphql';
import { Metadata, PaginationInput } from '@/types';
import { ArgsType, Field, ObjectType } from '@nestjs/graphql';

@ArgsType()
export class AllSettingLandingPageArgs extends FindManySettingArgs {
  @Field(() => PaginationInput, { nullable: true })
  pagination?: PaginationInput;

  @Field(() => String, { nullable: true })
  searchValue?: string;
}

@ArgsType()
export class AllSettingPortalArgs extends FindManySettingArgs {
  @Field(() => PaginationInput, { nullable: true })
  pagination?: PaginationInput;

  @Field(() => String, { nullable: true })
  searchValue?: string;

  @Field(() => Boolean, { nullable: true })
  isInit?: boolean;
}

@ObjectType()
export class AllSettingResult {
  @Field(() => [Setting])
  data: Setting[];

  @Field(() => Metadata, { nullable: true })
  metadata?: Metadata;
}
