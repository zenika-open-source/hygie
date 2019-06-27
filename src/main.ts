import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpService } from '@nestjs/common';
import { logger } from './logger/logger.service';
import { Constants } from './utils/constants';
import { DataAccessService } from './data_access/dataAccess.service';
import { Check } from './check/utils';
import { AllExceptionsFilter } from './exceptions/allExceptionFilter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Handle every exceptions
  app.useGlobalFilters(new AllExceptionsFilter());

  // Set View Engine
  app.setBaseViewsDir(join(__dirname, 'views'));
  app.setViewEngine('hbs');

  const port = process.env.PORT || 3000;

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST'],
    maxAge: 60,
  });

  if (await Check.checkInternet(app.get(HttpService))) {
    if (Check.checkNeededFiles([`src/rules/${Constants.rulesExtension}`])) {
      await app.get(DataAccessService).connect();

      await app.listen(port);
    }
  } else {
    logger.error('No internet connection');
  }
}
bootstrap().catch(err => logger.error(err));
