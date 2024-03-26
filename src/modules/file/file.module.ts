import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileResolver } from './file.resolver';
import { PrismaModule } from '@/prisma/prisma.module';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [PrismaModule, StorageModule.forRoot()],
  providers: [FileResolver, FileService],
  exports: [FileService]
})
export class FileModule {}
