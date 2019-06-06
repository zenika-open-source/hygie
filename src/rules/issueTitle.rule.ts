import { Rule } from './rule.class';
import { RuleResult } from './ruleResult';
import { GitEventEnum } from '../webhook/utils.enum';
import { Webhook } from '../webhook/webhook';
import { RuleDecorator } from './rule.decorator';
import { UsersOptions } from './common.interface';
import { Utils } from './utils';

interface IssueTitleOptions {
  regexp: string;
  users?: UsersOptions;
}

/**
 * `IssueTitleRule` checks the issue's title according to a regular expression.
 * @return return a `RuleResult` object
 */
@RuleDecorator('issueTitle')
export class IssueTitleRule extends Rule {
  options: IssueTitleOptions;
  events = [GitEventEnum.NewIssue];

  async validate(
    webhook: Webhook,
    ruleConfig: IssueTitleRule,
    ruleResults?: RuleResult[],
  ): Promise<RuleResult> {
    const ruleResult: RuleResult = new RuleResult(webhook.getGitApiInfos());
    const titleIssue = webhook.getIssueTitle();
    const issueRegExp = RegExp(ruleConfig.options.regexp);

    // First, check if rule need to be processed
    if (!Utils.checkUser(webhook, ruleConfig.options.users)) {
      return null;
    }

    ruleResult.validated = issueRegExp.test(titleIssue);

    ruleResult.data = {
      issueTitle: titleIssue,
      issueNumber: webhook.getIssueNumber(),
      matches: titleIssue.match(issueRegExp),
    };
    return Promise.resolve(ruleResult);
  }
}
