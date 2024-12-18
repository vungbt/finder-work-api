import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';
import { ApplicationService } from './application.service';
import { ApplicationResolver } from './application.resolver';

@Module({
  imports: [PrismaModule],
  providers: [ApplicationService, ApplicationResolver],
  exports: [ApplicationService]
})
export class ApplicationModule {}
