import { Module, HttpModule } from '@nestjs/common';
import { RulesModule } from '../rules/rules.module';
import { RunnableModule } from '../runnables/runnable.module';
import { GitModule } from '../git/git.module';
import { ScheduleService } from '../scheduler/scheduler.service';
import { MockDataAccess, MockAnalytics, MockCronController } from './mocks';
import { DocumentationController } from '../controllers/documentation.controller';
import { RegisterController } from '../controllers/register.controller';
import { WebhookController } from '../controllers/webhook.controller';
import { ApplicationController } from '../controllers/application.controller';

@Module({
  imports: [
    HttpModule,
    RulesModule.forRoot(MockAnalytics, MockDataAccess),
    RunnableModule.forRoot(MockAnalytics),
    GitModule,
  ],
  controllers: [
    ApplicationController,
    MockCronController,
    DocumentationController,
    RegisterController,
    WebhookController,
  ],
  providers: [ScheduleService],
})
export class MockAppModule {}
