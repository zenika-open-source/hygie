import { Rule } from './rule.class';
import { RuleResult } from './ruleResult';
import { GitEventEnum } from '../webhook/utils.enum';
import { Injectable } from '@nestjs/common';
import { Webhook } from '../webhook/webhook';
import { RuleDecorator } from './rule.decorator';

/**
 * `OneCommitPerPRRule` check if there is only one commit in the current PR/MR/Push
 * @return return a `RuleResult` object
 */
@Injectable()
@RuleDecorator('oneCommitPerPR')
export class OneCommitPerPRRule extends Rule {
  events = [GitEventEnum.Push];

  validate(webhook: Webhook, ruleConfig: OneCommitPerPRRule): RuleResult {
    const ruleResult: RuleResult = new RuleResult(webhook.getGitApiInfos());
    ruleResult.validated = webhook.getAllCommits().length === 1 ? true : false;
    ruleResult.data = {
      branch: webhook.getBranchName(),
      commits: webhook.getAllCommits(),
    };
    return ruleResult;
  }
}
