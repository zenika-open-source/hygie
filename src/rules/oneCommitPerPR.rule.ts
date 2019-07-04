import { Rule } from './rule.class';
import { RuleResult } from './ruleResult';
import { GitEventEnum } from '../webhook/utils.enum';
import { Webhook } from '../webhook/webhook';
import { RuleDecorator } from './rule.decorator';
import { UsersOptions } from './common.interface';
import { Utils } from './utils';
import { Inject } from '@nestjs/common';
import { Visitor } from 'universal-analytics';

interface OneCommitPerPROptions {
  users?: UsersOptions;
}

/**
 * `OneCommitPerPRRule` checks if there is only one commit in the current PR, MR or Push.
 * @return return a `RuleResult` object
 */
@RuleDecorator('oneCommitPerPR')
export class OneCommitPerPRRule extends Rule {
  events = [GitEventEnum.Push];
  options: OneCommitPerPROptions;

  constructor(
    @Inject('GoogleAnalytics')
    private readonly googleAnalytics: Visitor,
  ) {
    super();
  }

  async validate(
    webhook: Webhook,
    ruleConfig: OneCommitPerPRRule,
    ruleResults?: RuleResult[],
  ): Promise<RuleResult> {
    const ruleResult: RuleResult = new RuleResult(
      webhook.getGitApiInfos(),
      webhook.getCloneURL(),
    );
    this.googleAnalytics
      .event('Rule', 'oneCommitPerPR', webhook.getCloneURL())
      .send();

    // First, check if rule need to be processed
    if (
      typeof ruleConfig.options !== 'undefined' &&
      !Utils.checkUser(webhook, ruleConfig.options.users)
    ) {
      return null;
    }

    ruleResult.validated = webhook.getAllCommits().length === 1 ? true : false;
    ruleResult.data = {
      branch: webhook.getBranchName(),
      commits: webhook.getAllCommits(),
    };
    return Promise.resolve(ruleResult);
  }
}
