import { Rule } from './rule.class';
import { RuleResult } from './ruleResult';
import { GitEventEnum } from '../webhook/utils.enum';
import { Injectable } from '@nestjs/common';

/**
 * `OneCommitPerPRRule` check if there is only one commit in the current PR/MR/Push
 * @return return a `RuleResult` object
 */
@Injectable()
export class OneCommitPerPRRule extends Rule {
  name = 'oneCommitPerPR';
  events = [GitEventEnum.Push];

  validate(webhook, ruleConfig): RuleResult {
    const ruleResult: RuleResult = new RuleResult(webhook.getGitApiInfos());
    ruleResult.validated = webhook.getAllCommits().length === 1 ? true : false;
    ruleResult.data = {
      branch: webhook.getBranchName(),
      commits: webhook.getAllCommits(),
    };
    return ruleResult;
  }
}
