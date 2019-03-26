import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { checkNeededFiles } from './check/utils';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors());
  if (checkNeededFiles(['config.env', 'src/rules/rules.yml'])) {
    await app.listen(3000);
  }
}
bootstrap();
