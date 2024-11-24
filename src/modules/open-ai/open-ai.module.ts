import OpenAIApi from 'openai';
import { Module } from '@nestjs/common';
import { OpenAiService } from './open-ai.service';
import { OpenAiResolver } from './open-ai.resolver';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [
    OpenAiResolver,
    OpenAiService,
    {
      provide: OpenAIApi,
      useFactory: (configService: ConfigService) => {
        return new OpenAIApi({
          apiKey: configService.get<string>('OPENAI_API_KEY')
        });
      },
      inject: [ConfigService]
    }
  ],
  exports: [OpenAiService]
})
export class OpenAiModule {}
