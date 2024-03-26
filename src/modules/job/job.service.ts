import { PrismaService } from '@/prisma/prisma.service';
import { BaseService } from '@/utils/base/base.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class JobService implements BaseService {
  constructor(private readonly prismaService: PrismaService) {}
  create(args: Prisma.JobCreateArgs) {
    return this.prismaService.job.create(args);
  }
  findUnique(args: Prisma.JobFindUniqueArgs) {
    return this.prismaService.job.findUnique(args);
  }
  findFirst(args: Prisma.JobFindFirstArgs) {
    return this.prismaService.job.findFirst(args);
  }
  findMany(args: Prisma.JobFindManyArgs) {
    return this.prismaService.job.findMany(args);
  }
  count(args: Prisma.JobCountArgs) {
    return this.prismaService.job.count(args);
  }
  update(args: Prisma.JobUpdateArgs) {
    return this.prismaService.job.update(args);
  }
  delete(args: Prisma.JobDeleteArgs) {
    return this.prismaService.job.delete(args);
  }
}
