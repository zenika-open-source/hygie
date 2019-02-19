import { Rule } from './rule.class';
import { RuleResult } from './ruleResult';

interface BranchNameOptions {
  regexp: string;
}

export class BranchNameRule extends Rule {
  name = 'branchName';
  options: BranchNameOptions;

  validate(): RuleResult {
    const ruleResult: RuleResult = new RuleResult();
    const branchName = this.webhook.getBranchName();
    const branchRegExp = RegExp(this.options.regexp);
    ruleResult.validated = branchRegExp.test(branchName);

    return ruleResult;
  }
}
