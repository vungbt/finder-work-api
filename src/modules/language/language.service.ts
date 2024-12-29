import { LanguageWhereInput } from '@/prisma/graphql';
import { PrismaService } from '@/prisma/prisma.service';
import { responseHelper } from '@/utils/helpers';
import { Injectable } from '@nestjs/common';
import { AllLanguageArgs } from './language.type';
import { Prisma } from '@prisma/client';

@Injectable()
export class LanguageService {
  constructor(private readonly prismaService: PrismaService) {}
  async findMany(args: AllLanguageArgs) {
    const { searchValue, pagination, where, ...reset } = args;

    let whereClause: LanguageWhereInput = {};

    if (searchValue && searchValue.length > 0) {
      whereClause.OR = [{ name: { contains: searchValue, mode: 'insensitive' } }];
    }

    if (where) {
      whereClause = {
        AND: [whereClause, where]
      };
    }
    const data = this.prismaService.language.findMany({
      orderBy: { createdAt: 'asc' },
      where: whereClause,
      ...reset
    });
    const total = await this.count({ where: whereClause });
    return responseHelper(data, { total, ...pagination });
  }
  count(args: Prisma.LanguageCountArgs) {
    return this.prismaService.language.count(args);
  }
}
