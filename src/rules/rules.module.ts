import { Module, HttpModule, HttpService } from '@nestjs/common';
import { Rule } from './rule.class';
import { AppController } from '../app.controller';
import { RulesService } from './rules.service';

// tslint:disable-next-line:no-var-requires
const RulesValues = Object.values(require('./index.ts')).map(
  rule => rule as Rule,
);
const RulesProviders = RulesValues.map(rule => ({
  provide: rule,
  useClass: rule as any,
}));

@Module({
  imports: [HttpModule],
  exports: [RulesService],
  providers: [
    {
      provide: RulesService,
      useFactory(httpService, ...rules) {
        return new RulesService(httpService, rules);
      },
      inject: [HttpService, ...RulesValues],
    },
    ...RulesProviders,
  ],
})
export class RulesModule {}
