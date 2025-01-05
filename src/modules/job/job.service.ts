import { JobWhereInput } from '@/prisma/graphql';
import { PrismaService } from '@/prisma/prisma.service';
import { CurrentUser } from '@/types';
import { BaseService } from '@/utils/base/base.service';
import { genSlug, responseHelper } from '@/utils/helpers';
import { Injectable } from '@nestjs/common';
import { JobType, Prisma } from '@prisma/client';
import { AllJobArgs, CreateJobArgs, MyJobArgs } from './job.type';

@Injectable()
export class JobService implements BaseService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(args: CreateJobArgs, user: CurrentUser) {
    const data = args.data;
    const createdJob = await this.prismaService.job.create({
      data: {
        jobTitle: {
          connectOrCreate: {
            where: { name: data.jobTitleName },
            create: { name: data.jobTitleName }
          }
        },
        slug: genSlug(`${data.jobTitleName}-${data.type}`),
        tags: data.tags,
        description: data.description,
        type: data.type as JobType,
        salary: data.salary,
        company: data.company,
        addressDetail: data.addressDetail,
        skills: { connect: data.skillIds.map((id) => ({ id })) },
        level: data.level,
        address: data.address,
        jobCategory: data.jobCategory,
        salaryMetadata: data.salaryMetadata,
        user: { connect: { id: user.id } }
      }
    });

    return { status: 'success', job: createdJob };
  }
  findUnique(args: Prisma.JobFindUniqueArgs) {
    return this.prismaService.job.findUnique(args);
  }
  findFirst(args: Prisma.JobFindFirstArgs) {
    return this.prismaService.job.findFirst({
      ...args,
      include: {
        jobTitle: true,
        company: {
          include: {
            avatar: true
          }
        },
        address: true,
        jobCategory: true,
        skills: true
      }
    });
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

  async myJob(args: MyJobArgs) {
    const { searchValue, pagination, userId, where, ...reset } = args;
    let whereClause: JobWhereInput = {};

    if (searchValue && searchValue.length > 0) {
      whereClause.OR = [];
    }

    if (where) {
      whereClause = {
        AND: [whereClause, where]
      };
    }

    const data = this.prismaService.job.findMany({
      orderBy: { createdAt: 'desc' },
      where: { userId },
      include: {
        jobTitle: true,
        company: true,
        address: true,
        jobCategory: true,
        skills: true
      },
      ...reset
    });
    const total = await this.count({ where: whereClause });
    return responseHelper(data, { total, ...pagination });
  }

  async allJob(args: AllJobArgs) {
    const { searchValue, pagination, where, ...reset } = args;
    let whereClause: JobWhereInput = {};

    if (searchValue && searchValue.length > 0) {
      whereClause.OR = [];
    }

    if (where) {
      whereClause = {
        AND: [whereClause, where]
      };
    }
    const data = this.prismaService.job.findMany({
      orderBy: [{ isBoot: 'desc' }, { createdAt: 'desc' }],
      where: { ...whereClause },
      include: {
        tags: true,
        skills: true
      },
      ...reset
    });
    const total = await this.count({ where: whereClause });
    return responseHelper(data, { total, ...pagination });
  }
}
