import { Injectable, HttpService } from '@nestjs/common';
import { Rule } from './rule.class';
import { Runnable } from '../runnables/runnable';
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
    private readonly httpService: HttpService,
    private readonly githubService: GithubService,
    private readonly gitlabService: GitlabService,
    private readonly rulesClasses: Rule[],
  ) {}

  getRules(webhook: Webhook): Rule[] {
    const path = require('path');
    const config = safeLoad(
      readFileSync(path.resolve(__dirname, 'rules.yml'), 'utf-8'),
    );
    const rules: Rule[] = new Array();
    config.rules.forEach(r => {
      let rule: Rule;
      if (r.name === 'commitMessage') {
        rule = new CommitMessageRule(webhook);
      } else if (r.name === 'branchName') {
        rule = new BranchNameRule(webhook);
      } else if (r.name === 'oneCommitPerPR') {
        rule = new OneCommitPerPRRule(webhook);
      } else if (r.name === 'issueTitle') {
        rule = new IssueTitleRule(webhook);
      } else if (r.name === 'pullRequestTitle') {
        rule = new PullRequestTitleRule(webhook);
      }
      rule.name = r.name;

      if (typeof r.enabled !== 'undefined') {
        rule.enabled = r.enabled;
      }
      if (typeof r.events !== 'undefined') {
        rule.events = r.events;
      }
      rule.options = r.options;
      rule.onSuccess = r.onSuccess;
      rule.onError = r.onError;

      rules.push(rule);
    });
    return rules;
  }

  testRules(webhook: Webhook): RuleResult[] {
    const rules: Rule[] = this.getRules(webhook);
    const BreakException = {};
    const results: RuleResult[] = new Array();

    const runnable: Runnable = new Runnable(
      this.httpService,
      this.githubService,
      this.gitlabService,
    );
    try {
      rules.forEach(r => {
        if (r.isEnabled()) {
          const ruleResult: RuleResult = r.validate();
          results.push(ruleResult);
          runnable.executeRunnableFunctions(ruleResult, r);
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
