import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { checkNeededFiles, checkInternet } from './check/utils';
import * as cors from 'cors';
import { HttpService } from '@nestjs/common';
import { logger } from './logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST'],
    maxAge: 60,
  });

  if (await checkInternet(app.get(HttpService))) {
    if (checkNeededFiles(['config.env', 'src/rules/rules.yml'])) {
      await app.listen(3000);
    }
  } else {
    logger.error('No internet connexion');
  }
}
bootstrap();
