import { FindManyJobTitleArgs } from '@/prisma/graphql';
import { PrismaService } from '@/prisma/prisma.service';
import { BaseService } from '@/utils/base/base.service';
import { responseHelper } from '@/utils/helpers';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AllJobTitleArgs } from './job-title.type';

@Injectable()
export class JobTitleService implements BaseService {
  constructor(private readonly prismaService: PrismaService) {}

  create(args: Prisma.JobTitleCreateArgs) {
    return this.prismaService.jobTitle.create(args);
  }
  findUnique(args: Prisma.JobTitleFindUniqueArgs) {
    return this.prismaService.jobTitle.findUnique(args);
  }
  findFirst(args: Prisma.JobTitleFindFirstArgs) {
    return this.prismaService.jobTitle.findFirst(args);
  }
  async findMany(args: AllJobTitleArgs) {
    const { searchValue, pagination, ...reset } = args;

    const queries: FindManyJobTitleArgs = {};
    if (searchValue && searchValue.length > 0) {
      queries.where = {
        OR: [{ name: { contains: searchValue } }]
      };
    }
    const data = this.prismaService.jobTitle.findMany({
      orderBy: { createdAt: 'desc' },
      ...queries,
      ...reset
    });
    const total = await this.count(queries);
    return responseHelper(data, { total, ...pagination });
  }
  count(args: Prisma.JobTitleCountArgs) {
    return this.prismaService.jobTitle.count(args);
  }
  update(args: Prisma.JobTitleUpdateArgs) {
    return this.prismaService.jobTitle.update(args);
  }
  delete(args: Prisma.JobTitleDeleteArgs) {
    return this.prismaService.jobTitle.delete(args);
  }
}
