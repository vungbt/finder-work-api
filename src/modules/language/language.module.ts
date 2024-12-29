import { Module } from '@nestjs/common';
import { LanguageService } from './language.service';
import { LanguageResolver } from './language.resolver';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [LanguageResolver, LanguageService],
  exports: [LanguageService]
})
export class LanguageModule {}
