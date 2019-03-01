import { Rule } from './rule.class';
import { RuleResult } from './ruleResult';
import { GitEventEnum } from '../webhook/utils.enum';
import { Webhook } from '../webhook/webhook';

interface BranchNameOptions {
  regexp: string;
}

export class BranchNameRule extends Rule {
  name = 'branchName';
  options: BranchNameOptions;

  constructor(webhook: Webhook) {
    super(webhook);
    this.events = new Array();
    this.events.push(GitEventEnum.NewBranch);
  }

  validate(): RuleResult {
    const ruleResult: RuleResult = new RuleResult();
    const branchName = this.webhook.getBranchName();
    const branchRegExp = RegExp(this.options.regexp);
    ruleResult.validated = branchRegExp.test(branchName);
    ruleResult.data = {
      branch: branchName,
      branchSplit: branchName.split('/'),
      git: this.webhook.getGitType(),
      gitApiInfos: this.webhook.getGitApiInfos(),
    };

    return ruleResult;
  }
}
