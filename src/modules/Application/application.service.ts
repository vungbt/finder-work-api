import { PrismaService } from '@/prisma/prisma.service';
import { BaseService } from '@/utils/base/base.service';
import { Injectable } from '@nestjs/common';
import { Application, Prisma } from '@prisma/client';

@Injectable()
export class ApplicationService implements BaseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(args: Prisma.ApplicationCreateArgs): Promise<Application> {
    return await this.prisma.application.create(args);
  }

  async findUnique(params: Prisma.ApplicationFindUniqueArgs) {
    return this.prisma.application.findUnique(params);
  }

  async findFirst(params: Prisma.ApplicationFindFirstArgs) {
    return this.prisma.application.findFirst(params);
  }

  async findMany(params: Prisma.ApplicationFindManyArgs) {
    return this.prisma.application.findMany(params);
  }

  async count(params: Prisma.ApplicationCountArgs) {
    return this.prisma.application.count(params);
  }

  async update(params: Prisma.ApplicationUpdateArgs) {
    return this.prisma.application.update(params);
  }

  async delete(params: Prisma.ApplicationDeleteArgs) {
    return this.prisma.application.delete(params);
  }
}
