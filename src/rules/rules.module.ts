import { Module, HttpModule } from '@nestjs/common';
import { Rule } from './rule.class';
import { RulesService } from './rules.service';
import { RunnablesService } from '../runnables/runnables.service';
import { RunnableModule } from '../runnables/runnable.module';

export const RulesValues = Object.values(require('./index')).map(
  rule => rule as Rule,
);
const RulesProviders = RulesValues.map(rule => ({
  provide: rule,
  useClass: rule as any,
}));

@Module({
  imports: [HttpModule, RunnableModule],
  exports: [RulesService],
  providers: [
    {
      provide: RulesService,
      useFactory(runnableService, ...rules) {
        return new RulesService(runnableService, rules);
      },
      inject: [RunnablesService, ...RulesValues],
    },
    ...RulesProviders,
  ],
})
export class RulesModule {}
