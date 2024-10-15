import { FindManyReportPostArgs, ReportPost } from '@/prisma/graphql';
import { Metadata, PaginationInput } from '@/types';
import { ArgsType, Field, ObjectType } from '@nestjs/graphql';

@ArgsType()
export class AllReportPostArgs extends FindManyReportPostArgs {
  @Field(() => String, { nullable: true })
  searchValue?: string;

  @Field(() => PaginationInput, { nullable: true })
  pagination?: PaginationInput;
}

@ObjectType()
export class AllReportPostResult {
  @Field(() => [ReportPost], { defaultValue: [] })
  data: ReportPost[];

  @Field(() => Metadata, { nullable: true })
  metadata?: Metadata;
}
