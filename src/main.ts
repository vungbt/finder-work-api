import { AppModule } from '@/app.module';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { I18nMiddleware } from 'nestjs-i18n';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); //enable cors
  app.use(I18nMiddleware);
  await app.listen(process.env.PORT);
}
bootstrap()
  .then(() => {
    Logger.log(`App is running on port: http://localhost:${process.env.PORT}/graphql`);
  })
  .catch((err) => {
    console.error(err);
  });
