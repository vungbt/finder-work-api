import { AppConfig } from '@/configs/type';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EQueueEvent } from './queue.type';
import { EmailSendingProducer } from './producer/email-sending.producer';
import { EmailSendingProcessor } from './processor/email-sending.processor';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService<AppConfig>) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT')
        }
      })
    }),
    BullModule.registerQueue({
      name: EQueueEvent.EMAIL_SENDING
    })
  ],
  providers: [EmailSendingProducer, EmailSendingProcessor],
  exports: [EmailSendingProducer]
})
export class QueueModule {}
