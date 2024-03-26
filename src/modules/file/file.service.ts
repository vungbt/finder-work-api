import { PrismaService } from '@/prisma/prisma.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { StorageService } from '../storage/storage.service';
import { BaseService } from '@/utils/base/base.service';
import { Prisma } from '@prisma/client';
import { CreateFileOptions } from './file.type';
import { FileType } from '@/types';
import { pick } from 'lodash';

@Injectable()
export class FileService implements BaseService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly storageService: StorageService
  ) {}

  create(args: Prisma.FileCreateArgs) {
    return this.prismaService.file.create(args);
  }
  findUnique(args: Prisma.FileFindUniqueArgs) {
    return this.prismaService.file.findUnique(args);
  }
  findFirst(args: Prisma.FileFindFirstArgs) {
    return this.prismaService.file.findFirst(args);
  }
  findMany(args: Prisma.FileFindManyArgs) {
    return this.prismaService.file.findMany(args);
  }
  count(args: Prisma.FileCountArgs) {
    return this.prismaService.file.count(args);
  }
  update(args: Prisma.FileUpdateArgs) {
    return this.prismaService.file.update(args);
  }

  async delete(args: Prisma.FileDeleteArgs) {
    const file = await this.prismaService.file.delete(args);
    if (file) {
      await this.storageService.delete(file.storageId);
    }
    return true;
  }

  uploadUrl(name?: string) {
    return this.storageService.uploadUrl(name);
  }

  async createFromStorageId(id: string, options?: CreateFileOptions) {
    try {
      let storageFile: FileType;
      if (options?.folder) {
        storageFile = await this.storageService.move(id, options.folder);
      } else {
        storageFile = await this.storageService.getInfo(id);
      }
      // url: random(imagesUrl),
      // provider: 'cloudinary',
      // metadata: { width: 640, height: 480 },
      // storageId: faker.commerce.price(100, 700, 0)
      if (storageFile) {
        return this.create({
          data: {
            url: storageFile.url,
            storageId: storageFile.public_id,
            metadata: pick(storageFile, ['format', 'resource_type', 'bytes', 'height', 'width']),
            ...(options?.data || {})
          }
        });
      }
      throw new HttpException(
        {
          key: 'error.not_found'
        },
        HttpStatus.NOT_FOUND
      );
    } catch (error) {}
  }

  async createFromUrl(url: string, options?: CreateFileOptions) {
    const storageFile = await this.storageService.download(url);
    return this.createFromStorageId(storageFile.public_id, options);
  }
}
