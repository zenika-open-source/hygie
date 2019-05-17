import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { RulesModule } from './rules/rules.module';
import { RunnableModule } from './runnables/runnable.module';
import { GitModule } from './git/git.module';
import { ScheduleService } from './scheduler/scheduler.service';
@Module({
  imports: [HttpModule, RulesModule.forRoot(), RunnableModule, GitModule],
  controllers: [AppController],
  providers: [ScheduleService],
})
export class AppModule {}
