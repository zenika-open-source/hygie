import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { checkNeededFiles, checkInternet } from './check/utils';
import { HttpService } from '@nestjs/common';
import { logger } from './logger/logger.service';
import { Constants } from './utils/constants';
import { DataAccessService } from './data_access/dataAccess.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT || 3000;

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST'],
    maxAge: 60,
  });

  if (await checkInternet(app.get(HttpService))) {
    if (checkNeededFiles([`src/rules/${Constants.rulesExtension}`])) {
      await app.get(DataAccessService).connect();

      await app.listen(port);
    }
  } else {
    logger.error('No internet connection');
  }
}
bootstrap();
