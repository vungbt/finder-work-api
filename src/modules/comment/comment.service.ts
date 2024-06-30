import { Injectable } from '@nestjs/common';
import { BaseService } from '@/utils/base/base.service';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CommentService implements BaseService {
  constructor(private readonly prismaService: PrismaService) {}
  create(args: Prisma.CommentCreateArgs) {
    return this.prismaService.comment.create(args);
  }
  findUnique(args: Prisma.CommentFindUniqueArgs) {
    return this.prismaService.comment.findUnique(args);
  }
  findFirst(args: Prisma.CommentFindFirstArgs) {
    return this.prismaService.comment.findFirst(args);
  }
  findMany(args: Prisma.CommentFindManyArgs) {
    return this.prismaService.comment.findMany(args);
  }
  count(args: Prisma.CommentCountArgs) {
    return this.prismaService.comment.count(args);
  }
  update(args: Prisma.CommentUpdateArgs) {
    return this.prismaService.comment.update(args);
  }
  delete(args: Prisma.CommentDeleteArgs) {
    return this.prismaService.comment.delete(args);
  }
}
