import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { RulesModule } from './rules/rules.module';
import { RunnableModule } from './runnables/runnable.module';
import { GitModule } from './git/git.module';
import { ScheduleService } from './scheduler/scheduler.service';
import { DataAccessModule } from './data_access/dataAccess.module';
@Module({
  imports: [
    HttpModule,
    RulesModule,
    RunnableModule,
    GitModule,
    DataAccessModule,
  ],
  controllers: [AppController],
  providers: [ScheduleService],
})
export class AppModule {}
