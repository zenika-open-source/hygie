import { Rule } from './rule.class';
import { RuleResult } from './ruleResult';
import { GitEventEnum } from '../webhook/utils.enum';
import { Injectable } from '@nestjs/common';
import { Webhook } from '../webhook/webhook';

interface PullRequestTitleOptions {
  regexp: string;
}

/**
 * `PullRequestTitleRule` check the PR/MR's title according to a regular expression
 * @return return a `RuleResult` object
 */
@Injectable()
export class PullRequestTitleRule extends Rule {
  name = 'pullRequestTitle';
  options: PullRequestTitleOptions;
  events = [GitEventEnum.NewPR];

  validate(webhook: Webhook, ruleConfig: PullRequestTitleRule): RuleResult {
    const ruleResult: RuleResult = new RuleResult(webhook.getGitApiInfos());
    const titlePullRequest = webhook.getPullRequestTitle();
    const pullRequestRegExp = RegExp(ruleConfig.options.regexp);
    ruleResult.validated = pullRequestRegExp.test(titlePullRequest);

    ruleResult.data = {
      pullRequestTitle: titlePullRequest,
      pullRequestNumber: webhook.getPullRequestNumber(),
      pullRequestDescription: webhook.getPullRequestDescription(),
    };
    return ruleResult;
  }
}
