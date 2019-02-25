import { Rule } from './rule.class';
import { RuleResult } from './ruleResult';

interface PullRequestTitleOptions {
  regexp: string;
}

export class PullRequestTitleRule extends Rule {
  name = 'pullRequestTitle';
  options: PullRequestTitleOptions;

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
