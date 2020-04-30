import { Rule } from './rule.class';
import { RuleResult } from './ruleResult';
import { GitEventEnum } from '../webhook/utils.enum';
import { Webhook } from '../webhook/webhook';
import { RuleDecorator } from './rule.decorator';
import { UsersOptions } from './common.interface';
import { Utils } from './utils';
import { AnalyticsDecorator } from '../analytics/analytics.decorator';
import { HYGIE_TYPE } from '../utils/enum';

interface CheckPullRequestStatusOptions {
  status: string;
  users?: UsersOptions;
}

/**
 * `CheckPullRequestStatusRule` checks if the Pull Request event matchs.
 * @param status new|merged|closed|reopened
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

  getEvent(event: GitEventEnum): string {
    return event.toLowerCase().substring(0, event.length - 2);
  }

  @AnalyticsDecorator(HYGIE_TYPE.RULE)
  async validate(
    webhook: Webhook,
    ruleConfig: CheckPullRequestStatusRule,
    ruleResults?: RuleResult[],
  ): Promise<RuleResult> {
    const ruleResult: RuleResult = new RuleResult(webhook);
    const gitEvent = this.getEvent(webhook.gitEvent);

    // First, check if rule need to be processed
    if (!Utils.checkUser(webhook, ruleConfig.options.users)) {
      return null;
    }

    ruleResult.validated =
      gitEvent === ruleConfig.options.status.toLocaleLowerCase() ? true : false;

    ruleResult.data.pullRequest.event = gitEvent;

    return ruleResult;
  }
}
