import { FindManyCompanyTypeArgs } from '@/prisma/graphql';
import { PrismaService } from '@/prisma/prisma.service';
import { BaseService } from '@/utils/base/base.service';
import { responseHelper } from '@/utils/helpers';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AllCompanyTypeArgs } from './company-type.type';

@Injectable()
export class CompanyTypeService implements BaseService {
  constructor(private readonly prismaService: PrismaService) {}
  create(args: Prisma.CompanyTypeCreateArgs) {
    return this.prismaService.companyType.create(args);
  }
  findUnique(args: Prisma.CompanyTypeFindUniqueArgs) {
    return this.prismaService.companyType.findUnique(args);
  }
  findFirst(args: Prisma.CompanyTypeFindFirstArgs) {
    return this.prismaService.companyType.findFirst(args);
  }

  async findMany(args: AllCompanyTypeArgs) {
    const { pagination, searchValue, ...reset } = args;
    const queries: FindManyCompanyTypeArgs = {};

    if (searchValue && searchValue.length > 0) {
      queries.where = {
        OR: [{ key: { contains: searchValue } }]
      };
    }

    const data = this.prismaService.companyType.findMany({
      orderBy: { createdAt: 'desc' },
      ...queries,
      ...reset
    });
    const total = await this.count(queries);
    return responseHelper(data, { total, ...pagination });
  }

  count(args: Prisma.CompanyTypeCountArgs) {
    return this.prismaService.companyType.count(args);
  }
  update(args: Prisma.CompanyTypeUpdateArgs) {
    return this.prismaService.companyType.update(args);
  }
  delete(args: Prisma.CompanyTypeDeleteArgs) {
    return this.prismaService.companyType.delete(args);
  }
}
