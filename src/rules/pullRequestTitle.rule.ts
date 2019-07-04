import { Rule } from './rule.class';
import { RuleResult } from './ruleResult';
import { GitEventEnum } from '../webhook/utils.enum';
import { Webhook } from '../webhook/webhook';
import { RuleDecorator } from './rule.decorator';
import { UsersOptions } from './common.interface';
import { Utils } from './utils';
import { Inject } from '@nestjs/common';
import { Visitor } from 'universal-analytics';

interface PullRequestTitleOptions {
  regexp: string;
  users?: UsersOptions;
}

/**
 * `PullRequestTitleRule` checks the PR or MR's title according to a regular expression.
 * @return return a `RuleResult` object
 */
@RuleDecorator('pullRequestTitle')
export class PullRequestTitleRule extends Rule {
  options: PullRequestTitleOptions;
  events = [GitEventEnum.NewPR];

  constructor(
    @Inject('GoogleAnalytics')
    private readonly googleAnalytics: Visitor,
  ) {
    super();
  }

  async validate(
    webhook: Webhook,
    ruleConfig: PullRequestTitleRule,
    ruleResults?: RuleResult[],
  ): Promise<RuleResult> {
    const ruleResult: RuleResult = new RuleResult(
      webhook.getGitApiInfos(),
      webhook.getCloneURL(),
    );
    this.googleAnalytics
      .event('Rule', 'pullRequestTitle', webhook.getCloneURL())
      .send();

    // First, check if rule need to be processed
    if (!Utils.checkUser(webhook, ruleConfig.options.users)) {
      return null;
    }

    const titlePullRequest = webhook.getPullRequestTitle();
    const pullRequestRegExp = RegExp(ruleConfig.options.regexp);
    ruleResult.validated = pullRequestRegExp.test(titlePullRequest);

    ruleResult.data = {
      pullRequest: {
        title: titlePullRequest,
        number: webhook.getPullRequestNumber(),
        description: webhook.getPullRequestDescription(),
        matches: titlePullRequest.match(pullRequestRegExp),
      },
    };
    return ruleResult;
  }
}
