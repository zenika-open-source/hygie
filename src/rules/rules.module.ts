import { Module, HttpModule, HttpService } from '@nestjs/common';
import { Rule } from './rule.class';
import { RulesService } from './rules.service';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { RunnableService } from '../runnables/runnable';
import { RunnableModule } from '../runnables/runnable.module';

const RulesValues = Object.values(require('./index')).map(rule => rule as Rule);
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
      inject: [RunnableService, ...RulesValues],
    },
    ...RulesProviders,
  ],
})
export class RulesModule {}
