import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { checkNeededFiles } from './check/utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  if (
    checkNeededFiles(['config.env', 'src/rules/rules.yml', 'credentials.json'])
  ) {
    await app.listen(3000);
  }
}
bootstrap();
