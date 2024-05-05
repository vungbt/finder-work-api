import { FindManySettingArgs, SettingCreateInput, SettingUpdateInput } from '@/prisma/graphql';
import { PrismaService } from '@/prisma/prisma.service';
import { CurrentUser, ESettingKey } from '@/types';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import { AllSettingLandingPageArgs, AllSettingPortalArgs } from './setting.type';
import { responseHelper } from '@/utils/helpers';

@Injectable()
export class SettingService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(args: Prisma.SettingCreateArgs, currentUser: CurrentUser) {
    const body = args?.data as SettingCreateInput;

    // checking item unique constrain
    const settingItem = await this.findUnique({
      where: { key_type: { key: body.key, type: body.type } }
    });

    if (settingItem)
      throw new HttpException(
        { key: 'error.setting_unique_constraint' },
        HttpStatus.INTERNAL_SERVER_ERROR
      );

    // alway show with super_admin
    const newShowWith = body?.showWith?.set ?? [];
    if (!newShowWith.includes(UserRole.super_admin)) {
      newShowWith.push(UserRole.super_admin);
    }
    return this.prismaService.setting.create({
      data: { ...body, showWith: { set: newShowWith }, author: { connect: { id: currentUser.id } } }
    });
  }
  findUnique(args: Prisma.SettingFindUniqueArgs) {
    return this.prismaService.setting.findUnique(args);
  }
  findFirst(args: Prisma.SettingFindFirstArgs) {
    return this.prismaService.setting.findFirst(args);
  }
  findMany(args: Prisma.SettingFindManyArgs) {
    return this.prismaService.setting.findMany(args);
  }
  count(args: Prisma.SettingCountArgs) {
    return this.prismaService.setting.count(args);
  }
  update(args: Prisma.SettingUpdateArgs, currentUser: CurrentUser) {
    const body = args?.data as SettingUpdateInput;

    // alway show with super_admin
    const newShowWith = body?.showWith?.set ?? [];
    if (!newShowWith.includes(UserRole.super_admin)) {
      newShowWith.push(UserRole.super_admin);
    }

    return this.prismaService.setting.update({
      ...args,
      data: {
        ...body,
        showWith: { set: newShowWith },
        updatedBy: { connect: { id: currentUser.id } }
      }
    });
  }
  delete(args: Prisma.SettingDeleteArgs) {
    return this.prismaService.setting.delete(args);
  }

  async findAllSettingPortal(args: AllSettingPortalArgs, currentUser: CurrentUser) {
    const { searchValue, isInit, pagination, ...reset } = args;
    const role = currentUser.role;
    const showWith: any = [`${role}`];
    const queries: FindManySettingArgs = {};
    queries.where = {
      ...reset.where,
      showWith: { hasSome: showWith }
    };

    if (isInit) {
      queries.where = {
        showWith: { hasSome: showWith }
      };
    }

    if (searchValue && searchValue.length > 0) {
      queries.where = {
        OR: [
          { key: { contains: searchValue } },
          { type: { contains: searchValue } },
          {
            author: {
              is: {
                OR: [
                  { firstName: { contains: searchValue } },
                  { lastName: { contains: searchValue } }
                ]
              }
            }
          },
          {
            updatedBy: {
              is: {
                OR: [
                  { firstName: { contains: searchValue } },
                  { lastName: { contains: searchValue } }
                ]
              }
            }
          }
        ]
      };
    }

    delete reset.where;

    const total = await this.count(queries);
    const data = await this.findMany({ ...queries, ...reset });
    return responseHelper(data, { total, ...pagination });
  }

  async findAllSettingLandingPage(args: AllSettingLandingPageArgs) {
    const { pagination, ...reset } = args;
    const queries: FindManySettingArgs = {};
    queries.where = {
      ...reset.where,
      key: { equals: ESettingKey.landing_page }
    };
    delete reset.where;

    const total = await this.count(queries);
    const data = await this.findMany({ ...queries, ...reset });
    return responseHelper(data, { total, ...pagination });
  }
}
