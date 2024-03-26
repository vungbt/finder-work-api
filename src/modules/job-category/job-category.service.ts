import { Injectable } from '@nestjs/common';
import { BaseService } from '@/utils/base/base.service';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';

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
  findMany(args: Prisma.JobCategoryFindManyArgs) {
    return this.prismaService.jobCategory.findMany(args);
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
