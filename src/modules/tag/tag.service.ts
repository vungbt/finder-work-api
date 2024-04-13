import { PrismaService } from '@/prisma/prisma.service';
import { BaseService } from '@/utils/base/base.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class TagService implements BaseService {
  constructor(private readonly prismaService: PrismaService) {}
  create(args: Prisma.TagCreateArgs) {
    return this.prismaService.tag.create(args);
  }
  findUnique(args: Prisma.TagFindUniqueArgs) {
    return this.prismaService.tag.findUnique(args);
  }
  findFirst(args: Prisma.TagFindFirstArgs) {
    return this.prismaService.tag.findFirst(args);
  }
  findMany(args: Prisma.TagFindManyArgs) {
    return this.prismaService.tag.findMany(args);
  }
  count(args: Prisma.TagCountArgs) {
    return this.prismaService.tag.count(args);
  }
  update(args: Prisma.TagUpdateArgs) {
    return this.prismaService.tag.update(args);
  }
  delete(args: Prisma.TagDeleteArgs) {
    return this.prismaService.tag.delete(args);
  }
}
