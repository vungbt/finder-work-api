import { CompanyWhereInput } from '@/prisma/graphql';
import { PrismaService } from '@/prisma/prisma.service';
import { BaseService } from '@/utils/base/base.service';
import { responseHelper } from '@/utils/helpers';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AllCompanyArgs } from './company.type';

@Injectable()
export class CompanyService implements BaseService {
  constructor(private readonly prismaService: PrismaService) {}
  create(args: Prisma.CompanyCreateArgs) {
    return this.prismaService.company.create(args);
  }
  findUnique(args: Prisma.CompanyFindUniqueArgs) {
    return this.prismaService.company.findUnique(args);
  }
  findFirst(args: Prisma.CompanyFindFirstArgs) {
    return this.prismaService.company.findFirst(args);
  }

  async findMany(args: AllCompanyArgs) {
    const { pagination, searchValue, where, ...reset } = args;
    let whereClause: CompanyWhereInput = {};

    if (searchValue && searchValue.length > 0) {
      whereClause.OR = [{ name: { contains: searchValue } }];
    }

    if (where) {
      whereClause = {
        AND: [whereClause, where]
      };
    }

    const data = this.prismaService.company.findMany({
      orderBy: { createdAt: 'desc' },
      where: whereClause,
      ...reset
    });
    const total = await this.count({ where: whereClause });
    return responseHelper(data, { total, ...pagination });
  }

  count(args: Prisma.CompanyCountArgs) {
    return this.prismaService.company.count(args);
  }
  update(args: Prisma.CompanyUpdateArgs) {
    return this.prismaService.company.update(args);
  }
  delete(args: Prisma.CompanyDeleteArgs) {
    return this.prismaService.company.delete(args);
  }
}
