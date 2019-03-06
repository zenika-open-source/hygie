import { Rule } from './rule.class';
import { RuleResult } from './ruleResult';
import { GitEventEnum } from '../webhook/utils.enum';
import { Injectable } from '@nestjs/common';

interface BranchNameOptions {
  regexp: string;
}

/**
 * `BranchNameRule` check the branch's name according to a regular expression
 * @return return a `RuleResult` object
 */
@Injectable()
export class BranchNameRule extends Rule {
  name = 'branchName';
  options: BranchNameOptions;
  events = [GitEventEnum.NewBranch];

  validate(webhook, ruleConfig): RuleResult {
    const ruleResult: RuleResult = new RuleResult(webhook.getGitApiInfos());
    const branchName = webhook.getBranchName();
    const branchRegExp = RegExp(ruleConfig.options.regexp);
    ruleResult.validated = branchRegExp.test(branchName);
    ruleResult.data = {
      branch: branchName,
      branchSplit: branchName.split('/'),
    };

    return ruleResult;
  }
}
