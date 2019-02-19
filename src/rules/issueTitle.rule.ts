import { Rule } from './rule.class';
import { RuleResult } from './ruleResult';

interface IssueNameOptions {
  regexp: string;
}

export class IssueTitleRule extends Rule {
  name = 'issueTitle';
  options: IssueNameOptions;

  validate(): RuleResult {
    const ruleResult: RuleResult = new RuleResult();
    const issueTitle = this.webhook.getIssueTitle();
    const issueRegExp = RegExp(this.options.regexp);
    ruleResult.validated = issueRegExp.test(issueTitle);

    return ruleResult;
  }
}
