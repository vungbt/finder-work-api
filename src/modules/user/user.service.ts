import { PrismaService } from '@/prisma/prisma.service';
import { BaseService } from '@/utils/base/base.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService implements BaseService {
  constructor(private readonly prismaService: PrismaService) {}

  create(args: Prisma.UserCreateArgs) {
    return this.prismaService.user.create(args);
  }

  findUnique(args: Prisma.UserFindUniqueArgs) {
    return this.prismaService.user.findUnique(args);
  }

  findFirst(args: Prisma.UserFindFirstArgs) {
    return this.prismaService.user.findFirst(args);
  }

  findMany(args?: Prisma.UserFindManyArgs) {
    return this.prismaService.user.findMany(args);
  }

  count(args: Prisma.UserCountArgs) {
    return this.prismaService.user.count(args);
  }

  update(args: Prisma.UserUpdateArgs) {
    return this.prismaService.user.update(args);
  }

  delete(args: Prisma.UserDeleteArgs) {
    return this.prismaService.user.delete(args);
  }
}
