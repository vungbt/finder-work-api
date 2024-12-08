import { STORE_FOLDER } from '@/configs/constant';
import { CompanyWhereInput } from '@/prisma/graphql';
import { PrismaService } from '@/prisma/prisma.service';
import { CurrentUser } from '@/types';
import { BaseService } from '@/utils/base/base.service';
import { genSlug, responseHelper } from '@/utils/helpers';
import { HttpException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { FileService } from '../file/file.service';
import { AllCompanyArgs, CreateCompanyArgs, MyCompanyArgs } from './company.type';

@Injectable()
export class CompanyService implements BaseService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly fileService: FileService
  ) {}
  async create(args: CreateCompanyArgs, user: CurrentUser) {
    const data = args.data;
    let avatar;
    let files;
    if (!data.name) {
      throw new HttpException('Company name is required', 400);
    }
    if (!data.address) {
      throw new HttpException('Company address is required', 400);
    }
    try {
      avatar = await this.fileService.createFromStorageId(data.avatarPath, {
        folder: STORE_FOLDER
      });
      files = await this.fileService.createFromStorageIds(data.photosIds, {
        folder: STORE_FOLDER
      });
    } catch (error) {
      throw new HttpException('Error processing files', 400);
    }

    return await this.prismaService.company.create({
      data: {
        name: data.name,
        slug: genSlug(data.name),
        type: data.type,
        size: data.size,
        addressDetail: data.addressDetail,
        user: { connect: { id: user.id } },
        address: data.address,
        description: data.description,
        avatar: { connect: { id: avatar.id } },
        photos: { connect: files.map((item) => ({ id: item.id })) },
        industries: { connect: data.jobCategoriesIds.map((id) => ({ id })) },
        isDefault: data.isDefault
      }
    });
  }
  findUnique(args: Prisma.CompanyFindUniqueArgs) {
    return this.prismaService.company.findUnique(args);
  }
  findFirst(args: Prisma.CompanyFindFirstArgs) {
    return this.prismaService.company.findFirst({
      ...args,
      include: {
        avatar: true,
        photos: true,
        address: true,
        industries: true,
        type: true,
        size: true
      }
    });
  }

  async findMany(args: AllCompanyArgs) {
    const { pagination, searchValue, where, ...reset } = args;
    let whereClause: CompanyWhereInput = {};

    if (searchValue && searchValue.length > 0) {
      whereClause.OR = [{ name: { contains: searchValue } }];
    }

    if (where) {
      whereClause = {
        AND: [whereClause, where]
      };
    }

    const data = this.prismaService.company.findMany({
      orderBy: { createdAt: 'desc' },
      where: whereClause,
      ...reset
    });
    const total = await this.count({ where: whereClause });
    return responseHelper(data, { total, ...pagination });
  }

  count(args: Prisma.CompanyCountArgs) {
    return this.prismaService.company.count(args);
  }
  update(args: Prisma.CompanyUpdateArgs) {
    return this.prismaService.company.update(args);
  }
  delete(args: Prisma.CompanyDeleteArgs) {
    return this.prismaService.company.delete(args);
  }

  async myCompany(args: MyCompanyArgs) {
    const { searchValue, pagination, userId, where, ...reset } = args;
    let whereClause: CompanyWhereInput = {};

    if (searchValue && searchValue.length > 0) {
      whereClause.OR = [{ name: { contains: searchValue } }];
    }

    if (where) {
      whereClause = {
        AND: [whereClause, where]
      };
    }

    const data = this.prismaService.company.findMany({
      orderBy: { createdAt: 'desc' },
      where: { userId: userId, ...whereClause },
      include: {
        avatar: true,
        address: true,
        type: true,
        size: true
      },
      ...reset
    });
    const total = await this.count({ where: whereClause });
    return responseHelper(data, { total, ...pagination });
  }
}
