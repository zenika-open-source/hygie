import { Module, HttpModule } from '@nestjs/common';
import { RulesModule } from './rules/rules.module';
import { RunnableModule } from './runnables/runnable.module';
import { GitModule } from './git/git.module';
import { ScheduleService } from './scheduler/scheduler.service';
import { CronController } from './controllers/cron.controller';
import { DocumentationController } from './controllers/documentation.controller';
import { RegisterController } from './controllers/register.controller';
import { WebhookController } from './controllers/webhook.controller';
import { ApplicationController } from './controllers/application.controller';
import { analytics } from './analytics/analytics.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { PrometheusService } from './logger/prometheus.service';
import { DataAccessModule } from './data_access/dataAccess.module';
import { EnvVarController } from './controllers/env-var.controller';
import { EnvVarModule } from './env-var/env-var.module';
import { CommonModule } from './common/common.module';
import { WebhookSecretWhiteListChecker } from './interceptors/whiteList/webhookSecretWhiteListChecker.service';

@Module({
  imports: [
    HttpModule,
    DataAccessModule.forRoot(),
    RulesModule.forRoot(analytics),
    RunnableModule.forRoot(analytics),
    GitModule,
    EnvVarModule,
    CommonModule,
  ],
  controllers: [
    ApplicationController,
    CronController,
    DocumentationController,
    RegisterController,
    WebhookController,
    EnvVarController,
  ],
  providers: [
    {
      provide: 'WhiteListChecker',
      useClass: WebhookSecretWhiteListChecker,
    },
    PrometheusService,
    ScheduleService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
