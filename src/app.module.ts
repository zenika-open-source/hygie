import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { RulesModule } from './rules/rules.module';
import { RunnableModule } from './runnables/runnable.module';
import { GitModule } from './git.module';

@Module({
  imports: [HttpModule, RulesModule, RunnableModule, GitModule],
  controllers: [AppController],
})
export class AppModule {}
