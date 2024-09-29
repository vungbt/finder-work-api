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
  createMany(args: Prisma.FileCreateManyArgs) {
    return this.prismaService.file.createMany(args);
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

  uploadUrls(names: string[]) {
    return Promise.all(names.map((item) => this.storageService.uploadUrl(item)));
  }

  async createFromStorageId(id: string, options?: CreateFileOptions) {
    try {
      let storageFile: FileType;
      if (options?.folder) {
        storageFile = await this.storageService.move(id, options.folder);
      } else {
        storageFile = await this.storageService.getInfo(id);
      }
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

  async createFromStorageIds(ids: string[], options?: CreateFileOptions) {
    try {
      if (!ids || ids.length <= 0) return [];
      return await Promise.all(ids.map((id) => this.createFromStorageId(id, options)));
    } catch (error) {
      return [];
    }
  }

  async createFromUrl(url: string, options?: CreateFileOptions) {
    const storageFile = await this.storageService.download(url);
    return this.createFromStorageId(storageFile.public_id, options);
  }
}
