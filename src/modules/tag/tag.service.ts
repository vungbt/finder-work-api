import { TagWhereInput } from '@/prisma/graphql';
import { PrismaService } from '@/prisma/prisma.service';
import { BaseService } from '@/utils/base/base.service';
import { responseHelper } from '@/utils/helpers';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AllTagArgs } from './tag.type';

@Injectable()
export class TagService implements BaseService {
  constructor(private readonly prismaService: PrismaService) {}
  create(args: Prisma.TagCreateArgs) {
    return this.prismaService.tag.create(args);
  }
  findUnique(args: Prisma.TagFindUniqueArgs) {
    return this.prismaService.tag.findUnique(args);
  }
  findFirst(args: Prisma.TagFindFirstArgs) {
    return this.prismaService.tag.findFirst(args);
  }
  findMany(args: Prisma.TagFindManyArgs) {
    return this.prismaService.tag.findMany(args);
  }
  async findAll(args: AllTagArgs) {
    const { searchValue, pagination, where, ...reset } = args;

    let whereClause: TagWhereInput = {};
    if (searchValue && searchValue.length > 0) {
      whereClause.OR = [{ name: { contains: searchValue, mode: 'insensitive' } }];
    }

    if (where) {
      whereClause = {
        AND: [whereClause, where]
      };
    }

    const data = this.prismaService.tag.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      ...reset
    });
    const total = await this.count({ where: whereClause });
    return responseHelper(data, { total, ...pagination });
  }
  count(args: Prisma.TagCountArgs) {
    return this.prismaService.tag.count(args);
  }
  update(args: Prisma.TagUpdateArgs) {
    return this.prismaService.tag.update(args);
  }
  delete(args: Prisma.TagDeleteArgs) {
    return this.prismaService.tag.delete(args);
  }
}
