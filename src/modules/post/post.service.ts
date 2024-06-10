import { STORE_FOLDER } from '@/configs/constant';
import { PostWhereInput } from '@/prisma/graphql';
import { PrismaService } from '@/prisma/prisma.service';
import { CurrentUser } from '@/types';
import { BaseService } from '@/utils/base/base.service';
import { calculateReadingTime, genSlug, responseHelper } from '@/utils/helpers';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { FileService } from '../file/file.service';
import { AllPostArgs, CreatePostArgs } from './post.type';

@Injectable()
export class PostService implements BaseService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly fileService: FileService
  ) {}

  findUnique(args: Prisma.PostFindUniqueArgs) {
    return this.prismaService.post.findUnique(args);
  }
  findFirst(args: Prisma.PostFindFirstArgs) {
    return this.prismaService.post.findFirst(args);
  }
  async findMany(args: AllPostArgs) {
    const { searchValue, pagination, where, ...reset } = args;
    let whereClause: PostWhereInput = {};
    if (searchValue && searchValue.length > 0) {
      whereClause.OR = [{ title: { contains: searchValue, mode: 'insensitive' } }];
    }

    if (where) {
      whereClause = {
        AND: [whereClause, where]
      };
    }

    const data = this.prismaService.post.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        tags: true,
        thumbnails: true
      },
      ...reset
    });
    const total = await this.count({ where: whereClause });
    return responseHelper(data, { total, ...pagination });
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
  async create(args: CreatePostArgs, user: CurrentUser) {
    const data = args.data;
    const thumbnailsIds = data.thumbnailIds;
    delete data.thumbnailIds;
    const files = await this.fileService.createFromStorageIds(thumbnailsIds, {
      folder: STORE_FOLDER
    });
    return this.prismaService.post.create({
      data: {
        ...data,
        author: { connect: { id: user.id } },
        minRead: calculateReadingTime(data.content),
        slug: genSlug(data.title),
        thumbnails: { connect: files.map((item) => ({ id: item.id })) }
      }
    });
  }
}
