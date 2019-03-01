import { Rule } from './rule.class';
import { RuleResult } from './ruleResult';
import { Webhook } from '../webhook/webhook';
import { GitEventEnum } from '../webhook/utils.enum';

export class OneCommitPerPRRule extends Rule {
  name = 'oneCommitPerPR';

  constructor(webhook: Webhook) {
    super(webhook);
    this.events = new Array();
    this.events.push(GitEventEnum.Push);
  }

  validate(): RuleResult {
    const ruleResult: RuleResult = new RuleResult();
    ruleResult.validated =
      this.webhook.getAllCommits().length === 1 ? true : false;
    ruleResult.data = {
      commits: this.webhook.getAllCommits(),
    };
    return ruleResult;
  }
}
