import { Injectable } from '@nestjs/common';
import { BaseService } from '@/utils/base/base.service';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma } from '@prisma/client';

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
  findMany(args: Prisma.JobTitleFindManyArgs) {
    return this.prismaService.jobTitle.findMany(args);
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
