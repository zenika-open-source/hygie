import { Rule } from './rule.class';
import { RuleResult } from './ruleResult';
import { Webhook } from '../webhook/webhook';
import { GitEventEnum } from '../webhook/utils.enum';

interface IssueTitleOptions {
  regexp: string;
}

export class IssueTitleRule extends Rule {
  name = 'issueTitle';
  options: IssueTitleOptions;
  events = [GitEventEnum.NewIssue];

  validate(webhook, ruleConfig): RuleResult {
    const ruleResult: RuleResult = new RuleResult(webhook.getGitApiInfos());
    const titleIssue = webhook.getIssueTitle();
    const issueRegExp = RegExp(ruleConfig.options.regexp);
    ruleResult.validated = issueRegExp.test(titleIssue);

    ruleResult.data = {
      issueTitle: titleIssue,
      issueNumber: webhook.getIssueNumber(),
    };
    return ruleResult;
  }
}
