import { FindManyJobCategoryArgs } from '@/prisma/graphql';
import { PrismaService } from '@/prisma/prisma.service';
import { BaseService } from '@/utils/base/base.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AllJobCategoryArgs } from './job-category.type';
import { responseHelper } from '@/utils/helpers';

@Injectable()
export class JobCategoryService implements BaseService {
  constructor(private readonly prismaService: PrismaService) {}

  create(args: Prisma.JobCategoryCreateArgs) {
    return this.prismaService.jobCategory.create(args);
  }
  findUnique(args: Prisma.JobCategoryFindUniqueArgs) {
    return this.prismaService.jobCategory.findUnique(args);
  }
  findFirst(args: Prisma.JobCategoryFindFirstArgs) {
    return this.prismaService.jobCategory.findFirst(args);
  }
  async findMany(args: AllJobCategoryArgs) {
    const { searchValue, pagination, ...reset } = args;
    const queries: FindManyJobCategoryArgs = {};
    if (searchValue && searchValue.length > 0) {
      queries.where = {
        OR: [{ name: { contains: searchValue } }]
      };
    }

    const data = this.prismaService.jobCategory.findMany({
      orderBy: { createdAt: 'desc' },
      ...queries,
      ...reset
    });
    const total = await this.count(queries);
    return responseHelper(data, { total, ...pagination });
  }
  count(args: Prisma.JobCategoryCountArgs) {
    return this.prismaService.jobCategory.count(args);
  }
  update(args: Prisma.JobCategoryUpdateArgs) {
    return this.prismaService.jobCategory.update(args);
  }
  delete(args: Prisma.JobCategoryDeleteArgs) {
    return this.prismaService.jobCategory.delete(args);
  }
}
