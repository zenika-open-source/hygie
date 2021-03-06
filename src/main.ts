import 'module-alias/register';

import '~common/config/index';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpService, Logger } from '@nestjs/common';
import { Constants } from './utils/constants';
import { DataAccessService } from './data_access/dataAccess.service';
import { Check } from './check/utils';
import { AllExceptionsFilter } from './exceptions/allExceptionFilter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, 'public'));

  // Handle every exceptions
  app.useGlobalFilters(new AllExceptionsFilter());

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
    Logger.error('No internet connection');
  }
}
bootstrap().catch(err => Logger.error(err));
