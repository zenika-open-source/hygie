import { Rule } from './rule.class';

export class OneCommitPerPR extends Rule {
  validate(): boolean {
    const ruleSuccessed: boolean =
      this.webhook.getAllCommits().length === 1 ? true : false;
    return this.excecuteValidationFunctions(ruleSuccessed);
  }
}
