import { Rule } from './rule.class';
import { RuleResult } from './ruleResult';
import { GitEventEnum } from '../webhook/utils.enum';
import { Webhook } from '../webhook/webhook';
import { RuleDecorator } from './rule.decorator';

interface PullRequestTitleOptions {
  regexp: string;
}

/**
 * `PullRequestTitleRule` check the PR or MR's title according to a regular expression
 * @return return a `RuleResult` object
 */
@RuleDecorator('pullRequestTitle')
export class PullRequestTitleRule extends Rule {
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
