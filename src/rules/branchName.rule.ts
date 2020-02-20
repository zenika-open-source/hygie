import { Rule } from './rule.class';
import { RuleResult } from './ruleResult';
import { GitEventEnum } from '../webhook/utils.enum';
import { Webhook } from '../webhook/webhook';
import { RuleDecorator } from './rule.decorator';
import { UsersOptions } from './common.interface';
import { Utils } from './utils';
import { AnalyticsDecorator } from '../analytics/analytics.decorator';
import { HYGIE_TYPE } from '../utils/enum';

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

  @AnalyticsDecorator(HYGIE_TYPE.RULE)
  async validate(
    webhook: Webhook,
    ruleConfig: BranchNameRule,
    ruleResults?: RuleResult[],
  ): Promise<RuleResult> {
    const ruleResult: RuleResult = new RuleResult(webhook);
    const branchName = webhook.getBranchName();
    const branchRegExp = RegExp(ruleConfig.options.regexp);

    // First, check if rule need to be processed
    if (!Utils.checkUser(webhook, ruleConfig.options.users)) {
      return null;
    }

    ruleResult.validated = branchRegExp.test(branchName);

    ruleResult.data.branchSplit = branchName.split('/');
    ruleResult.data.matches = branchName.match(branchRegExp);

    return ruleResult;
  }
}
