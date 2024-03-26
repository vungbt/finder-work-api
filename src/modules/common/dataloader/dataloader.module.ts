import { Module } from '@nestjs/common';
import { DataloaderService } from './dataloader.service';
import { FileModule } from '../../file/file.module';
import { AddressModule } from '@/modules/address/address.module';

@Module({
  imports: [FileModule, AddressModule],
  providers: [DataloaderService],
  exports: [DataloaderService]
})
export class DataloaderModule {}
