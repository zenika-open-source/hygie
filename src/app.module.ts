import { Module, HttpModule } from '@nestjs/common';
import { RulesModule } from './rules/rules.module';
import { RunnableModule } from './runnables/runnable.module';
import { GitModule } from './git/git.module';
import { ScheduleService } from './scheduler/scheduler.service';
import { CronController } from './controllers/cron.controller';
import { DocumentationController } from './controllers/documentation.controller';
import { RegisterController } from './controllers/register.controller';
import { WebhookController } from './controllers/webhook.controller';
import { AppplicationController } from './controllers/application.controller';
@Module({
  imports: [HttpModule, RulesModule.forRoot(), RunnableModule, GitModule],
  controllers: [
    AppplicationController,
    CronController,
    DocumentationController,
    RegisterController,
    WebhookController,
  ],
  providers: [ScheduleService],
})
export class AppModule {}
