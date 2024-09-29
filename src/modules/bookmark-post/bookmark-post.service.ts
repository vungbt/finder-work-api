import { PrismaService } from '@/prisma/prisma.service';
import { CurrentUser } from '@/types';
import { BaseService } from '@/utils/base/base.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BookmarkPostArgs } from './bookmark-post.type';
import { responseHelper } from '@/utils/helpers';

@Injectable()
export class BookmarkPostService implements BaseService {
  constructor(private readonly prismaService: PrismaService) {}

  findUnique(args: Prisma.BookmarkPostFindUniqueArgs) {
    return this.prismaService.bookmarkPost.findUnique(args);
  }
  findFirst(args: Prisma.BookmarkPostFindFirstArgs) {
    return this.prismaService.bookmarkPost.findFirst(args);
  }
  findMany(args: Prisma.BookmarkPostFindManyArgs) {
    return this.prismaService.bookmarkPost.findMany(args);
  }
  count(args: Prisma.BookmarkPostCountArgs) {
    return this.prismaService.bookmarkPost.count(args);
  }
  delete(args: Prisma.BookmarkPostDeleteArgs) {
    return this.prismaService.bookmarkPost.delete(args);
  }
  update(args: Prisma.BookmarkPostUpdateArgs) {
    return this.prismaService.bookmarkPost.update(args);
  }
  create(args: Prisma.BookmarkPostCreateArgs) {
    return this.prismaService.bookmarkPost.create(args);
  }
  async bookmark(args: BookmarkPostArgs, user: CurrentUser) {
    let bookmarkItem = await this.findFirst({ where: { postId: args.postId, userId: user.id } });
    let status = 'deleted';
    if (bookmarkItem) {
      bookmarkItem = await this.delete({ where: { id: bookmarkItem.id } });
      status = 'deleted';
    } else {
      bookmarkItem = await this.create({
        data: { post: { connect: { id: args.postId } }, user: { connect: { id: user.id } } }
      });
      status = 'created';
    }
    return responseHelper(bookmarkItem, { status });
  }
}
