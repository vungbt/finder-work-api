import { PrismaService } from '@/prisma/prisma.service';
import { BaseService } from '@/utils/base/base.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AllReportPostArgs } from './report-post.type';
import { responseHelper } from '@/utils/helpers';
import { FindManyReportPostArgs, ReportPostWhereInput } from '@/prisma/graphql';

@Injectable()
export class ReportPostService implements BaseService {
  constructor(private readonly prismaService: PrismaService) {}
  create(args: Prisma.ReportPostCreateArgs) {
    return this.prismaService.reportPost.create(args);
  }
  findUnique(args: Prisma.ReportPostFindUniqueArgs) {
    return this.prismaService.reportPost.findUnique(args);
  }
  findFirst(args: Prisma.ReportPostFindFirstArgs) {
    return this.prismaService.reportPost.findFirst(args);
  }
  async findAll(args: AllReportPostArgs) {
    const { searchValue, pagination, ...reset } = args;
    const queries: FindManyReportPostArgs = {};
    if (searchValue && searchValue.length > 0) {
      queries.where = {
        OR: [{ reason: { contains: searchValue } }]
      };
    }
    const data = this.prismaService.reportPost.findMany({
      orderBy: { createdAt: 'desc' },
      ...queries,
      ...reset
    });
    const total = await this.count(queries);
    return responseHelper(data, { total, ...pagination });
  }

  async findMany(args: AllReportPostArgs) {
    const { searchValue, pagination, where, ...reset } = args;
    let whereClause: ReportPostWhereInput = {};
    if (searchValue && searchValue.length > 0) {
      whereClause.OR = [
        { reason: { contains: searchValue, mode: 'insensitive' } },
        { message: { contains: searchValue, mode: 'insensitive' } },
        { post: { is: { slug: { contains: searchValue, mode: 'insensitive' } } } }
      ];
    }

    if (where) {
      whereClause = {
        AND: [whereClause, where]
      };
    }
    const data = this.prismaService.reportPost.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      ...reset,
      include: {
        user: true,
        post: {
          select: {
            id: true,
            slug: true
          }
        }
      }
    });
    const total = await this.count({ where: whereClause });
    return responseHelper(data, { total, ...pagination });
  }
  count(args: Prisma.ReportPostCountArgs) {
    return this.prismaService.reportPost.count(args);
  }
  update(args: Prisma.ReportPostUpdateArgs) {
    return this.prismaService.reportPost.update(args);
  }
  delete(args: Prisma.ReportPostDeleteArgs) {
    return this.prismaService.reportPost.delete(args);
  }
}
