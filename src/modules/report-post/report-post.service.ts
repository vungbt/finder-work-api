import { PrismaService } from '@/prisma/prisma.service';
import { BaseService } from '@/utils/base/base.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AllReportPostArgs } from './report-post.type';
import { FindManyReportPostArgs } from '@/prisma/graphql';
import { responseHelper } from '@/utils/helpers';

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
  findMany(args: Prisma.ReportPostFindManyArgs) {
    return this.prismaService.reportPost.findMany(args);
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
