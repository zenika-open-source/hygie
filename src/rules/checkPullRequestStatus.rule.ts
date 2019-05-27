import { Rule } from './rule.class';
import { RuleResult } from './ruleResult';
import { GitEventEnum } from '../webhook/utils.enum';
import { Webhook } from '../webhook/webhook';
import { RuleDecorator } from './rule.decorator';

interface CheckPullRequestStatusOptions {
  status: string;
}

/**
 * `CheckPullRequestStatusRule` checks if the Pull Request event matchs.
 * @params status: new, merged, closed, reopened
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

  async validate(
    webhook: Webhook,
    ruleConfig: CheckPullRequestStatusRule,
  ): Promise<RuleResult> {
    const ruleResult: RuleResult = new RuleResult(webhook.getGitApiInfos());
    const gitEvent = this.getEvent(webhook.gitEvent);
    ruleResult.validated =
      gitEvent === ruleConfig.options.status.toLocaleLowerCase() ? true : false;

    ruleResult.data = {
      pullRequestEvent: gitEvent,
      pullRequestTitle: webhook.getPullRequestTitle(),
      pullRequestNumber: webhook.getPullRequestNumber(),
      pullRequestDescription: webhook.getPullRequestDescription(),
    };

    return Promise.resolve(ruleResult);
  }
}
