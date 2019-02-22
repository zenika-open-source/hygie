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

@Injectable()
export class RulesService {
  constructor(
    private readonly httpService: HttpService,
    private readonly githubService: GithubService,
    private readonly gitlabService: GitlabService,
    private readonly rulesClasses: Rule[],
  ) {}

  getRules(webhook: Webhook): Rule[] {
    const config = safeLoad(readFileSync('src/rules/rules.yml', 'utf-8'));
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
      }
      rule.name = r.name;
      rule.enabled = r.enabled;
      rule.events = r.events;
      rule.options = r.options;
      rule.onSuccess = r.onSuccess;
      rule.onError = r.onError;

      rules.push(rule);
    });
    return rules;
  }

  testRules(webhook: Webhook): void {
    const rules: Rule[] = this.getRules(webhook);
    const BreakException = {};

    const runnable: Runnable = new Runnable(
      this.httpService,
      this.githubService,
      this.gitlabService,
    );
    try {
      rules.forEach(r => {
        if (r.isEnabled()) {
          const ruleResult: RuleResult = r.validate();
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
  }
}
