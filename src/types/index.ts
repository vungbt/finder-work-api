import { Field, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Metadata {
  @Field(() => Number)
  total: number;

  @Field(() => Number, { nullable: true })
  page?: number;

  @Field(() => Number, { nullable: true })
  limit?: number;
}

@InputType()
export class PaginationInput {
  @Field()
  page: number;

  @Field(() => Number, { nullable: true })
  limit?: number;
}

export class FileType {
  public_id: string;
  version: number;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  url: string;
  secure_url: string;
  access_mode: string;
}
