import { Injectable } from '@nestjs/common';
import { BaseService } from '@/utils/base/base.service';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { AllSkillArgs } from './skill.type';
import { SkillWhereInput } from '@/prisma/graphql';
import { responseHelper } from '@/utils/helpers';

@Injectable()
export class SkillService implements BaseService {
  constructor(private readonly prismaService: PrismaService) {}
  create(args: Prisma.SkillCreateArgs) {
    return this.prismaService.skill.create(args);
  }
  findUnique(args: Prisma.SkillFindUniqueArgs) {
    return this.prismaService.skill.findUnique(args);
  }
  findFirst(args: Prisma.SkillFindFirstArgs) {
    return this.prismaService.skill.findFirst(args);
  }
  async findMany(args: Prisma.SkillFindManyArgs) {
    return this.prismaService.skill.findMany(args);
  }

  async findAll(args: AllSkillArgs) {
    const { searchValue, pagination, where, ...reset } = args;
    let whereClause: SkillWhereInput = {};
    if (searchValue && searchValue.length > 0) {
      whereClause.OR = [{ content: { contains: searchValue, mode: 'insensitive' } }];
    }
    if (where) {
      whereClause = {
        AND: [whereClause, where]
      };
    }
    const data = this.prismaService.skill.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      ...reset
    });
    const total = await this.count({ where: whereClause });
    return responseHelper(data, { total, ...pagination });
  }
  count(args: Prisma.SkillCountArgs) {
    return this.prismaService.skill.count(args);
  }
  update(args: Prisma.SkillUpdateArgs) {
    return this.prismaService.skill.update(args);
  }
  delete(args: Prisma.SkillDeleteArgs) {
    return this.prismaService.skill.delete(args);
  }
}
