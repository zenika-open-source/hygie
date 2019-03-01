import { Rule } from './rule.class';
import { RuleResult } from './ruleResult';
import { Webhook } from '../webhook/webhook';
import { GitEventEnum } from '../webhook/utils.enum';

interface PullRequestTitleOptions {
  regexp: string;
}

export class PullRequestTitleRule extends Rule {
  name = 'pullRequestTitle';
  options: PullRequestTitleOptions;

  constructor(webhook: Webhook) {
    super(webhook);
    this.events = new Array();
    this.events.push(GitEventEnum.NewPR);
  }

  validate(): RuleResult {
    const ruleResult: RuleResult = new RuleResult();
    const titlePullRequest = this.webhook.getPullRequestTitle();
    const pullRequestRegExp = RegExp(this.options.regexp);
    ruleResult.validated = pullRequestRegExp.test(titlePullRequest);

    ruleResult.data = {
      pullRequestTitle: titlePullRequest,
      pullRequestNumber: this.webhook.getPullRequestNumber(),
      pullRequestDescription: this.webhook.getPullRequestDescription(),
      git: this.webhook.getGitType(),
      gitApiInfos: this.webhook.getGitApiInfos(),
    };
    return ruleResult;
  }
}
