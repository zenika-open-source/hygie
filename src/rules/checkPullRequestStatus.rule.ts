import { Rule } from './rule.class';
import { RuleResult } from './ruleResult';
import { GitEventEnum } from '../webhook/utils.enum';
import { Webhook } from '../webhook/webhook';
import { RuleDecorator } from './rule.decorator';

interface CheckPullRequestStatusOptions {
  status: string;
}

/**
 * `CheckPullRequestStatusRule` check if the PR event match.
 * @return return a `RuleResult` object
 */
@RuleDecorator('checkPullRequestStatus')
export class CheckPullRequestStatusRule extends Rule {
  options: CheckPullRequestStatusOptions;
  events = [
    GitEventEnum.NewPR,
    GitEventEnum.ClosedPR,
    GitEventEnum.MergedPR,
    GitEventEnum.ReopenedPR,
  ];
  async validate(
    webhook: Webhook,
    ruleConfig: CheckPullRequestStatusRule,
  ): Promise<RuleResult> {
    const ruleResult: RuleResult = new RuleResult(webhook.getGitApiInfos());

    ruleResult.validated =
      webhook.gitEvent.toLowerCase() ===
      ruleConfig.options.status.toLocaleLowerCase()
        ? true
        : false;

    ruleResult.data = {
      PREvent: webhook.gitEvent,
    };

    return Promise.resolve(ruleResult);
  }
}
