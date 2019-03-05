import { Injectable, HttpService } from '@nestjs/common';
import { Rule } from './rule.class';
import { RunnableService } from '../runnables/runnable';
import { Webhook } from '../webhook/webhook';
import { RuleResult } from './ruleResult';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { safeLoad } from 'js-yaml';
import { readFileSync } from 'fs';
import { CommitMessageRule, BranchNameRule, OneCommitPerPRRule } from '.';
import { IssueTitleRule } from './issueTitle.rule';
import { PullRequestTitleRule } from './pullRequestTitle.rule';

@Injectable()
export class RulesService {
  constructor(
    private readonly runnableService: RunnableService,
    private readonly httpService: HttpService,
    private readonly githubService: GithubService,
    private readonly gitlabService: GitlabService,
    private readonly rulesClasses: Rule[] = [],
  ) {}

  getRulesConfiguration() {
    const path = require('path');
    const config = safeLoad(
      readFileSync(path.resolve(__dirname, 'rules.yml'), 'utf-8'),
    );
    return config.rules;
  }

  getRule(ruleConfig): Rule {
    return this.rulesClasses.find(r => r.name === ruleConfig.name);
  }

  testRules(webhook: Webhook): RuleResult[] {
    const rules: Rule[] = this.getRulesConfiguration();
    const BreakException = {};
    const results: RuleResult[] = new Array();

    try {
      rules.forEach(ruleConfig => {
        const r = this.getRule(ruleConfig);
        if (r.isEnabled(webhook, ruleConfig)) {
          const ruleResult: RuleResult = r.validate(webhook, ruleConfig);
          results.push(ruleResult);

          this.runnableService.executeRunnableFunctions(ruleResult, ruleConfig);
          if (!ruleResult.validated) {
            throw BreakException;
          }
        }
      });
    } catch (e) {
      if (e !== BreakException) {
        throw e;
      }
    }

    return results;
  }
}
