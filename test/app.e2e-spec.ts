import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { DataloaderModule } from '@/modules/common/dataloader/dataloader.module';
import { DataloaderService } from '@/modules/common/dataloader/dataloader.service';
import { join } from 'path';
import { GraphQLError } from 'graphql';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
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
        })
      ]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect('Hello World!');
  });
});
