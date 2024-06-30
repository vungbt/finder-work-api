import { PrismaService } from '@/prisma/prisma.service';
import { BaseService } from '@/utils/base/base.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AllPostCategoryArgs } from './post-category.type';
import { FindManyPostCategoryArgs } from '@/prisma/graphql';
import { responseHelper } from '@/utils/helpers';

@Injectable()
export class PostCategoryService implements BaseService {
  constructor(private readonly prismaService: PrismaService) {}
  create(args: Prisma.PostCategoryCreateArgs) {
    return this.prismaService.postCategory.create(args);
  }
  findUnique(args: Prisma.PostCategoryFindUniqueArgs) {
    return this.prismaService.postCategory.findUnique(args);
  }
  findFirst(args: Prisma.PostCategoryFindFirstArgs) {
    return this.prismaService.postCategory.findFirst(args);
  }
  async findAll(args: AllPostCategoryArgs) {
    const { searchValue, pagination, ...reset } = args;
    const queries: FindManyPostCategoryArgs = {};
    if (searchValue && searchValue.length > 0) {
      queries.where = {
        OR: [{ name: { contains: searchValue } }]
      };
    }
    const data = this.prismaService.postCategory.findMany({
      orderBy: { createdAt: 'desc' },
      ...queries,
      ...reset
    });
    const total = await this.count(queries);
    return responseHelper(data, { total, ...pagination });
  }
  findMany(args: Prisma.PostCategoryFindManyArgs) {
    return this.prismaService.postCategory.findMany(args);
  }
  count(args: Prisma.PostCategoryCountArgs) {
    return this.prismaService.postCategory.count(args);
  }
  update(args: Prisma.PostCategoryUpdateArgs) {
    return this.prismaService.postCategory.update(args);
  }
  delete(args: Prisma.PostCategoryDeleteArgs) {
    return this.prismaService.postCategory.delete(args);
  }
}
