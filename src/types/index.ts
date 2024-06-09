import { IDataloaders } from '@/modules/common/dataloader/dataloader.type';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { UserRole } from '@prisma/client';

@ObjectType()
export class Metadata {
  @Field(() => Number, { nullable: true })
  total?: number;

  @Field(() => Number, { nullable: true })
  page?: number;

  @Field(() => Number, { nullable: true })
  limit?: number;

  @Field(() => String, { nullable: true })
  status?: string;
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

export class CurrentUser {
  id: string;
  role: UserRole;
}

export class ContextType {
  loaders: IDataloaders;
  req: {
    user: CurrentUser;
  };
}

export enum ESettingKey {
  admin = 'admin',
  employer = 'employer',
  employee = 'employee',
  super_admin = 'super_admin',
  landing_page = 'landing_page'
}
