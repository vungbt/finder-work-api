import { LanguageSkillWhereInput } from '@/prisma/graphql';
import { PrismaService } from '@/prisma/prisma.service';
import { BaseService } from '@/utils/base/base.service';
import { responseHelper } from '@/utils/helpers';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AllLanguageSkillArgs } from './language-skill.type';

@Injectable()
export class LanguageSkillService implements BaseService {
  constructor(private readonly prismaService: PrismaService) {}

  create(args: Prisma.LanguageSkillCreateArgs) {
    return this.prismaService.languageSkill.create(args);
  }
  findUnique(args: Prisma.LanguageSkillFindUniqueArgs) {
    return this.prismaService.languageSkill.findUnique(args);
  }
  findFirst(args: Prisma.LanguageSkillFindFirstArgs) {
    return this.prismaService.languageSkill.findFirst(args);
  }
  async findMany(args: AllLanguageSkillArgs) {
    const { searchValue, pagination, where, ...reset } = args;

    let whereClause: LanguageSkillWhereInput = {};

    if (searchValue && searchValue.length > 0) {
      whereClause.OR = [{ name: { contains: searchValue, mode: 'insensitive' } }];
    }

    if (where) {
      whereClause = {
        AND: [whereClause, where]
      };
    }
    const data = this.prismaService.languageSkill.findMany({
      orderBy: { createdAt: 'asc' },
      where: whereClause,
      ...reset
    });
    const total = await this.count({ where: whereClause });
    return responseHelper(data, { total, ...pagination });
  }
  count(args: Prisma.LanguageSkillCountArgs) {
    return this.prismaService.languageSkill.count(args);
  }
  update(args: Prisma.LanguageSkillUpdateArgs) {
    return this.prismaService.languageSkill.update(args);
  }
  delete(args: Prisma.LanguageSkillDeleteArgs) {
    return this.prismaService.languageSkill.delete(args);
  }
}
