import { Rule } from './rule.class';
import { RuleResult } from './ruleResult';
import { GitEventEnum } from '../webhook/utils.enum';
import { Webhook } from '../webhook/webhook';
import { RuleDecorator } from './rule.decorator';
import { UsersOptions } from './common.interface';
import { Utils } from './utils';

interface BranchNameOptions {
  regexp: string;
  users?: UsersOptions;
}

/**
 * `BranchNameRule` checks the branch's name according to a regular expression.
 * @return return a `RuleResult` object
 */
@RuleDecorator('branchName')
export class BranchNameRule extends Rule {
  options: BranchNameOptions;
  events = [GitEventEnum.NewBranch];

  async validate(
    webhook: Webhook,
    ruleConfig: BranchNameRule,
    ruleResults?: RuleResult[],
  ): Promise<RuleResult> {
    const ruleResult: RuleResult = new RuleResult(webhook.getGitApiInfos());
    const branchName = webhook.getBranchName();
    const branchRegExp = RegExp(ruleConfig.options.regexp);

    // First, check if rule need to be processed
    if (!Utils.checkUser(webhook, ruleConfig.options.users)) {
      return null;
    }

    ruleResult.validated = branchRegExp.test(branchName);
    ruleResult.data = {
      branch: branchName,
      branchSplit: branchName.split('/'),
    };

    return Promise.resolve(ruleResult);
  }
}
