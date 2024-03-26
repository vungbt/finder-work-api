import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressResolver } from './address.resolver';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  exports: [AddressService],
  providers: [AddressResolver, AddressService]
})
export class AddressModule {}
