import { Injectable } from '@nestjs/common';
import { BaseService } from '@/utils/base/base.service';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';

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
  findMany(args: Prisma.SkillFindManyArgs) {
    return this.prismaService.skill.findMany(args);
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
