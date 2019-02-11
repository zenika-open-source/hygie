import { Rule } from './rule.class';

interface BranchNameOptions {
  regexp: string;
}

export class BranchNameRule extends Rule {
  options: BranchNameOptions;

  validate(): boolean {
    const branchName = this.webhook.getBranchName();
    const branchRegExp = RegExp(this.options.regexp);
    const ruleSuccessed: boolean = branchRegExp.test(branchName);

    return this.excecuteValidationFunctions(ruleSuccessed);
  }
}
