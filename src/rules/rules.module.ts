import { Module, HttpModule, DynamicModule } from '@nestjs/common';
import { Rule } from './rule.class';
import { RulesService } from './rules.service';
import { RunnablesService } from '../runnables/runnables.service';
import { RunnableModule } from '../runnables/runnable.module';
import { DataAccessService } from '../data_access/dataAccess.service';
import { DataAccessModule } from '../data_access/dataAccess.module';
import { Visitor } from 'universal-analytics';
import { CommonModule } from '~common/common.module';
import { LoggerService } from '~common/providers/logger/logger.service';

export const RulesValues = Object.values(require('./index')).map(
  rule => rule as Rule,
);
const RulesProviders: any = RulesValues.map(rule => ({
  provide: rule,
  useClass: rule as any,
}));

@Module({
  imports: [HttpModule, CommonModule],
  exports: [RulesService],
  providers: [
    {
      provide: RulesService,
      useFactory(runnableService, dataAccessService, loggerService, ...rules) {
        return new RulesService(
          runnableService,
          dataAccessService,
          loggerService,
          rules,
        );
      },
      inject: [
        RunnablesService,
        DataAccessService,
        LoggerService,
        ...RulesValues,
      ],
    },
    ...RulesProviders,
  ],
})
export class RulesModule {
  static forRoot(analytics: Visitor, entity: any = null): DynamicModule {
    return {
      module: RulesModule,
      imports: [
        DataAccessModule.forRoot(entity),
        RunnableModule.forRoot(analytics),
      ],
      providers: [{ provide: 'GoogleAnalytics', useValue: analytics }],
    };
  }
}
