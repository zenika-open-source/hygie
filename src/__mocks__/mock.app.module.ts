import { Module, HttpModule } from '@nestjs/common';
import { AppController } from '../app.controller';
import { RulesModule } from '../rules/rules.module';
import { RunnableModule } from '../runnables/runnable.module';
import { GitModule } from '../git/git.module';
import { ScheduleService } from '../scheduler/scheduler.service';
import { MockDataAccess } from './mocks';

@Module({
  imports: [
    HttpModule,
    RulesModule.forRoot(MockDataAccess),
    RunnableModule,
    GitModule,
  ],
  controllers: [AppController],
  providers: [ScheduleService],
})
export class MockAppModule {}
