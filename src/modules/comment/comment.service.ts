import { CommentWhereInput } from '@/prisma/graphql';
import { PrismaService } from '@/prisma/prisma.service';
import { BaseService } from '@/utils/base/base.service';
import { responseHelper } from '@/utils/helpers';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AllCommentArgs, CreateCommentArgs } from './comment.type';

@Injectable()
export class CommentService implements BaseService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(args: CreateCommentArgs, userId?: string) {
    const data = args.data;
    const parentId = data.parentId;
    if (parentId) {
      const commentLv2 = await this.prismaService.comment.findFirst({
        where: { replies: { some: { id: { in: [parentId] } } }, parentId: { not: null } },
        select: { id: true, parentId: true }
      });
      if (commentLv2 && commentLv2.parentId)
        throw new HttpException(
          {
            key: 'error.forbidden'
          },
          HttpStatus.FORBIDDEN
        );
    }
    return this.prismaService.comment.create({
      data: {
        content: data.content,
        post: {
          connect: { id: data.postId }
        },
        parent: data.parentId
          ? {
              connect: {
                id: data.parentId
              }
            }
          : undefined,
        user: userId
          ? {
              connect: { id: userId }
            }
          : undefined
      }
    });
  }
  findUnique(args: Prisma.CommentFindUniqueArgs) {
    return this.prismaService.comment.findUnique(args);
  }
  findFirst(args: Prisma.CommentFindFirstArgs) {
    return this.prismaService.comment.findFirst(args);
  }
  async findMany(args: AllCommentArgs) {
    const { searchValue, pagination, where, ...reset } = args;
    let whereClause: CommentWhereInput = {};

    if (searchValue && searchValue.length > 0) {
      whereClause.OR = [{ content: { contains: searchValue } }];
    }

    if (where) {
      whereClause = {
        AND: [whereClause, where]
      };
    }

    const data = this.prismaService.comment.findMany({
      orderBy: { createdAt: 'desc' },
      where: whereClause,
      ...reset
    });

    const total = await this.count({ where: whereClause });
    return responseHelper(data, { total, ...pagination });
  }
  findAll(args: Prisma.CommentFindManyArgs) {
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
