import { Module, HttpModule, Logger } from '@nestjs/common';
import { RulesModule } from '../rules/rules.module';
import { RunnableModule } from '../runnables/runnable.module';
import { GitModule } from '../git/git.module';
import { ScheduleService } from '../scheduler/scheduler.service';
import {
  MockDataAccess,
  MockCronController,
  MockLoggingInterceptor,
  MockEnvVarController,
} from './mocks';
import { DocumentationController } from '../controllers/documentation.controller';
import { RegisterController } from '../controllers/register.controller';
import { WebhookController } from '../controllers/webhook.controller';
import { ApplicationController } from '../controllers/application.controller';
import { PrometheusService } from '../logger/prometheus.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DataAccessService } from '../data_access/dataAccess.service';
import { EnvVarModule } from '../env-var/env-var.module';
import { CommonModule } from '~common/common.module';
import { WebhookSecretWhiteListChecker } from '../interceptors/whiteList/webhookSecretWhiteListChecker.service';
import { LoggerService } from '~common/providers/logger/logger.service';

@Module({
  imports: [
    HttpModule,
    RulesModule.forRoot(MockDataAccess),
    RunnableModule,
    GitModule,
    EnvVarModule,
    CommonModule,
  ],
  controllers: [
    ApplicationController,
    MockCronController,
    DocumentationController,
    RegisterController,
    WebhookController,
    MockEnvVarController,
  ],
  providers: [
    Logger,
    LoggerService,
    {
      provide: 'WhiteListChecker',
      useClass: WebhookSecretWhiteListChecker,
    },
    {
      provide: DataAccessService,
      useFactory() {
        const mock = new MockDataAccess();
        return new DataAccessService(mock);
      },
    },
    PrometheusService,
    ScheduleService,
    {
      provide: APP_INTERCEPTOR,
      useClass: MockLoggingInterceptor,
    },
  ],
})
export class MockAppModule {}
