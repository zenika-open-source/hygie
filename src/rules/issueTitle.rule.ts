import { Rule } from './rule.class';
import { RuleResult } from './ruleResult';
import { GitEventEnum } from '../webhook/utils.enum';
import { Webhook } from '../webhook/webhook';
import { RuleDecorator } from './rule.decorator';

interface IssueTitleOptions {
  regexp: string;
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
  ): Promise<RuleResult> {
    const ruleResult: RuleResult = new RuleResult(webhook.getGitApiInfos());
    const titleIssue = webhook.getIssueTitle();
    const issueRegExp = RegExp(ruleConfig.options.regexp);
    ruleResult.validated = issueRegExp.test(titleIssue);

    ruleResult.data = {
      issueTitle: titleIssue,
      issueNumber: webhook.getIssueNumber(),
    };
    return Promise.resolve(ruleResult);
  }
}
