import { Rule } from './rule.class';
import { RuleResult } from './ruleResult';

interface IssueTitleOptions {
  regexp: string;
}

export class IssueTitleRule extends Rule {
  name = 'issueTitle';
  options: IssueTitleOptions;

  validate(): RuleResult {
    const ruleResult: RuleResult = new RuleResult();
    const titleIssue = this.webhook.getIssueTitle();
    const issueRegExp = RegExp(this.options.regexp);
    ruleResult.validated = issueRegExp.test(titleIssue);

    ruleResult.data = {
      issueTitle: titleIssue,
      git: this.webhook.getGitType(),
      issueNumber: this.webhook.getIssueNumber(),
      gitApiInfos: this.webhook.getGitApiInfos(),
    };
    return ruleResult;
  }
}
