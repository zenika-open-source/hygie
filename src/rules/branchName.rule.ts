import { Rule } from './rule.class';
import { RuleResult } from './ruleResult';
import { GitEventEnum } from '../webhook/utils.enum';
import { Webhook } from '../webhook/webhook';
import { RuleDecorator } from './rule.decorator';
import { UsersOptions } from './common.interface';
import { Utils } from './utils';
import { Inject } from '@nestjs/common';
import { Visitor } from 'universal-analytics';

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

  constructor(
    @Inject('GoogleAnalytics')
    private readonly googleAnalytics: Visitor,
  ) {
    super();
  }

  async validate(
    webhook: Webhook,
    ruleConfig: BranchNameRule,
    ruleResults?: RuleResult[],
  ): Promise<RuleResult> {
    const ruleResult: RuleResult = new RuleResult(webhook.getGitApiInfos());
    const branchName = webhook.getBranchName();
    const branchRegExp = RegExp(ruleConfig.options.regexp);

    this.googleAnalytics
      .event('Rule', 'branchName', webhook.getCloneURL())
      .send();

    // First, check if rule need to be processed
    if (!Utils.checkUser(webhook, ruleConfig.options.users)) {
      return null;
    }

    ruleResult.validated = branchRegExp.test(branchName);
    ruleResult.data = {
      branch: branchName,
      branchSplit: branchName.split('/'),
      matches: branchName.match(branchRegExp),
    };

    return Promise.resolve(ruleResult);
  }
}
