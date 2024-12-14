import { Module } from '@nestjs/common';
import { LanguageSkillService } from './language-skill.service';
import { LanguageSkillResolver } from './language-skill.resolver';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [LanguageSkillResolver, LanguageSkillService],
  exports: [LanguageSkillService]
})
export class LanguageSkillModule {}
