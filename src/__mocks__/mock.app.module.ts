import { Module, HttpModule } from '@nestjs/common';
import { AppController } from '../app.controller';
import { RulesModule } from '../rules/rules.module';
import { RunnableModule } from '../runnables/runnable.module';
import { GitModule } from '../git/git.module';
import { ScheduleService } from '../scheduler/scheduler.service';
import { MockDataAccess } from './mocks';
import { DataAccessService } from '../data_access/dataAccess.service';
import { DataAccessModule } from '../data_access/dataAccess.module';

@Module({
  providers: [
    DataAccessService,
    {
      provide: 'DataAccessInterface',
      useFactory() {
        return new MockDataAccess();
      },
    },
  ],
  exports: [DataAccessService],
})
class MockDataAccessModule {}

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
