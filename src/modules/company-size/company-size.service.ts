import { FindManyCompanySizeArgs } from '@/prisma/graphql';
import { PrismaService } from '@/prisma/prisma.service';
import { BaseService } from '@/utils/base/base.service';
import { responseHelper } from '@/utils/helpers';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AllCompanySizeArgs } from './company-size.type';

@Injectable()
export class CompanySizeService implements BaseService {
  constructor(private readonly prismaService: PrismaService) {}
  create(args: Prisma.CompanySizeCreateArgs) {
    return this.prismaService.companySize.create(args);
  }
  findUnique(args: Prisma.CompanySizeFindUniqueArgs) {
    return this.prismaService.companySize.findUnique(args);
  }
  findFirst(args: Prisma.CompanySizeFindFirstArgs) {
    return this.prismaService.companySize.findFirst(args);
  }

  async findMany(args: AllCompanySizeArgs) {
    const { pagination, searchValue, ...reset } = args;
    const queries: FindManyCompanySizeArgs = {};

    if (searchValue && searchValue.length > 0) {
      queries.where = {
        OR: [{ key: { contains: searchValue } }]
      };
    }

    const data = this.prismaService.companySize.findMany({
      orderBy: { createdAt: 'desc' },
      ...queries,
      ...reset
    });
    const total = await this.count(queries);
    return responseHelper(data, { total, ...pagination });
  }

  count(args: Prisma.CompanySizeCountArgs) {
    return this.prismaService.companySize.count(args);
  }
  update(args: Prisma.CompanySizeUpdateArgs) {
    return this.prismaService.companySize.update(args);
  }
  delete(args: Prisma.CompanySizeDeleteArgs) {
    return this.prismaService.companySize.delete(args);
  }
}
