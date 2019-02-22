import { Rule } from './rule.class';
import { RuleResult } from './ruleResult';

export class OneCommitPerPRRule extends Rule {
  name = 'oneCommitPerPR';
  validate(): RuleResult {
    const ruleResult: RuleResult = new RuleResult();
    ruleResult.validated =
      this.webhook.getAllCommits().length === 1 ? true : false;
    ruleResult.data = {
      commits: this.webhook.getAllCommits(),
    };
    return ruleResult;
  }
}
