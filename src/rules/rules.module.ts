import { Module, HttpModule, HttpService } from '@nestjs/common';
import { Rule } from './rule.class';
import { RulesService } from './rules.service';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';

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
      useFactory(githubService, gitlabService, httpService, ...rules) {
        return new RulesService(
          httpService,
          githubService,
          gitlabService,
          rules,
        );
      },
      inject: [GithubService, GitlabService, HttpService, ...RulesValues],
    },
    GithubService,
    GitlabService,
    ...RulesProviders,
  ],
})
export class RulesModule {}
