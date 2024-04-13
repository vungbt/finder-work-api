import { ComplexityPlugin } from '@/utils/plugins/complexity.plugin';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CacheModule } from '@nestjs/cache-manager';
import { HttpStatus, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import * as redisStore from 'cache-manager-ioredis';
import { GraphQLError } from 'graphql';
import {
  AcceptLanguageResolver,
  GraphQLWebsocketResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver
} from 'nestjs-i18n';
import { join } from 'path';
import { AppConfig } from './configs/type';
import { validate } from './configs/validation';
import { AddressModule } from './modules/address/address.module';
import { AuthModule } from './modules/auth/auth.module';
import { DataloaderModule } from './modules/common/dataloader/dataloader.module';
import { DataloaderService } from './modules/common/dataloader/dataloader.service';
import { QueueModule } from './modules/common/queue/queue.module';
import { CompanySizeModule } from './modules/company-size/company-size.module';
import { CompanyTypeModule } from './modules/company-type/company-type.module';
import { CompanyModule } from './modules/company/company.module';
import { FileModule } from './modules/file/file.module';
import { JobCategoryModule } from './modules/job-category/job-category.module';
import { JobTitleModule } from './modules/job-title/job-title.module';
import { JobModule } from './modules/job/job.module';
import { PostModule } from './modules/post/post.module';
import { SkillModule } from './modules/skill/skill.module';
import { UserModule } from './modules/user/user.module';
import { HttpExceptionFilter } from './utils/exception/http-exception.filter';
import { PostCategoryModule } from './modules/post-category/post-category.module';
import { TagModule } from './modules/tag/tag.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      validate
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService<AppConfig>) => ({
        store: redisStore,
        host: configService.get<string>('REDIS_HOST'),
        port: configService.get<number>('REDIS_PORT'),
        ttl: configService.get<number>('REDIS_TTL')
      })
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService<AppConfig>) => ({
        transport: {
          host: configService.get('MAIL_HOST'),
          secure: false,
          auth: {
            user: configService.get('MAIL_USER'),
            pass: configService.get('MAIL_PASSWORD')
          },
          tls: {
            rejectUnauthorized: false
          }
        },
        defaults: {
          from: `"No Reply" <${configService.get('MAIL_FROM')}>`
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(undefined, {
            inlineCssEnabled: true
          }),
          options: {
            strict: true
          }
        }
      }),
      inject: [ConfigService]
    }),
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage: configService.getOrThrow('FALLBACK_LANGUAGE'),
        loaderOptions: {
          path: join(__dirname, '/i18n/'),
          watch: true
        }
      }),
      resolvers: [
        GraphQLWebsocketResolver,
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang'])
      ],
      inject: [ConfigService]
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [DataloaderModule],
      useFactory: async (dataloaderService: DataloaderService): Promise<ApolloDriverConfig> => {
        return {
          playground: true,
          autoSchemaFile: join(process.cwd(), 'schema.gql'),
          formatError: (error: GraphQLError) => {
            return {
              statusCode:
                HttpStatus[error.extensions.code as any] ||
                (error.extensions.response as any)?.statusCode,
              message: error.message,
              path: error.path
            };
          },
          context: (ctx) => ({
            ...ctx,
            loaders: dataloaderService.getLoaders()
          }),
          subscriptions: {
            'subscriptions-transport-ws': {
              onConnect: (params) => ({ connectionParams: params }),
              path: '/graphql'
            }
          }
        };
      },
      inject: [DataloaderService]
    }),
    DataloaderModule,
    UserModule,
    AuthModule,
    PostModule,
    JobModule,
    JobTitleModule,
    JobCategoryModule,
    AddressModule,
    SkillModule,
    CompanyModule,
    FileModule,
    CompanyTypeModule,
    CompanySizeModule,
    QueueModule,
    PostCategoryModule,
    TagModule
  ],
  controllers: [],
  providers: [
    ComplexityPlugin,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
    }
  ]
})
export class AppModule {}
