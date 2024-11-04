import { UserWhereInput } from '@/prisma/graphql';
import { PrismaService } from '@/prisma/prisma.service';
import { BaseService } from '@/utils/base/base.service';
import { responseHelper } from '@/utils/helpers';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import { AllUserArgs, MeArgs } from './user.type';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class UserService implements BaseService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nService
  ) {}

  create(args: Prisma.UserCreateArgs) {
    return this.prismaService.user.create(args);
  }

  findUnique(args: Prisma.UserFindUniqueArgs) {
    return this.prismaService.user.findUnique(args);
  }

  findFirst(args: Prisma.UserFindFirstArgs) {
    return this.prismaService.user.findFirst(args);
  }

  async findMany(args?: AllUserArgs) {
    const { searchValue, pagination, where, ...reset } = args;
    let whereClause: UserWhereInput = {
      role: {
        notIn: [UserRole.admin, UserRole.super_admin]
      }
    };
    if (searchValue && searchValue.length > 0) {
      whereClause.OR = [{ firstName: { contains: searchValue, mode: 'insensitive' } }];
      whereClause.OR = [{ lastName: { contains: searchValue, mode: 'insensitive' } }];
    }
    if (where) {
      whereClause = {
        AND: [whereClause, where]
      };
    }
    const data = this.prismaService.user.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        avatar: true
      },
      ...reset
    });

    const total = await this.count({ where: whereClause });
    return responseHelper(data, { total, ...pagination });
  }

  count(args: Prisma.UserCountArgs) {
    return this.prismaService.user.count(args);
  }

  update(args: Prisma.UserUpdateArgs) {
    return this.prismaService.user.update(args);
  }

  delete(args: Prisma.UserDeleteArgs) {
    return this.prismaService.user.delete(args);
  }

  async me(args: MeArgs) {
    const user = await this.prismaService.user.findFirst({ where: { id: args.userId } });
    if (!user)
      throw new HttpException(
        { key: 'validation.invalid', args: { label: this.i18n.t('common.user.title') } },
        HttpStatus.NOT_FOUND
      );

    return user;
  }
}
