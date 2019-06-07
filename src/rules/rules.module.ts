import { Module, HttpModule, DynamicModule } from '@nestjs/common';
import { Rule } from './rule.class';
import { RulesService } from './rules.service';
import { RunnablesService } from '../runnables/runnables.service';
import { RunnableModule } from '../runnables/runnable.module';
import { DataAccessService } from '../data_access/dataAccess.service';
import { DataAccessModule } from '../data_access/dataAccess.module';
import { Visitor } from 'universal-analytics';

export const RulesValues = Object.values(require('./index')).map(
  rule => rule as Rule,
);
const RulesProviders: any = RulesValues.map(rule => ({
  provide: rule,
  useClass: rule as any,
}));

@Module({
  imports: [HttpModule],
  exports: [RulesService],
  providers: [
    {
      provide: RulesService,
      useFactory(runnableService, dataAccessService, ...rules) {
        return new RulesService(runnableService, dataAccessService, rules);
      },
      inject: [RunnablesService, DataAccessService, ...RulesValues],
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
