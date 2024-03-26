import { PrismaService } from '@/prisma/prisma.service';
import { BaseService } from '@/utils/base/base.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class PostService implements BaseService {
  constructor(private readonly prismaService: PrismaService) {}

  findUnique(args: Prisma.PostFindUniqueArgs) {
    return this.prismaService.post.findUnique(args);
  }
  findFirst(args: Prisma.PostFindFirstArgs) {
    return this.prismaService.post.findFirst(args);
  }
  findMany(args: Prisma.PostFindManyArgs) {
    return this.prismaService.post.findMany(args);
  }
  count(args: Prisma.PostCountArgs) {
    return this.prismaService.post.count(args);
  }
  delete(args: Prisma.PostDeleteArgs) {
    return this.prismaService.post.delete(args);
  }
  update(args: Prisma.PostUpdateArgs) {
    return this.prismaService.post.update(args);
  }
  create(args: Prisma.PostCreateArgs) {
    return this.prismaService.post.create(args);
  }
}
