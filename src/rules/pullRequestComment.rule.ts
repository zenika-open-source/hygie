import { Rule } from './rule.class';
import { RuleResult } from './ruleResult';
import { GitEventEnum } from '../webhook/utils.enum';
import { Webhook } from '../webhook/webhook';
import { RuleDecorator } from './rule.decorator';
import { UsersOptions } from './common.interface';
import { Utils } from './utils';

interface PullRequestCommentOptions {
  regexp: string;
  users?: UsersOptions;
}

/**
 * `PullRequestCommentRule` checks the new PR or MR's comment according to a regular expression.
 * @return return a `RuleResult` object
 */
@RuleDecorator('pullRequestComment')
export class PullRequestCommentRule extends Rule {
  options: PullRequestCommentOptions;
  events = [GitEventEnum.NewPRComment];

  async validate(
    webhook: Webhook,
    ruleConfig: PullRequestCommentRule,
    ruleResults?: RuleResult[],
  ): Promise<RuleResult> {
    const ruleResult: RuleResult = new RuleResult(webhook.getGitApiInfos());

    // First, check if rule need to be processed
    if (!Utils.checkUser(webhook, ruleConfig.options.users)) {
      return null;
    }

    const commentDescription = webhook.getCommentDescription();
    const commentRegExp = RegExp(ruleConfig.options.regexp);
    ruleResult.validated = commentRegExp.test(commentDescription);

    ruleResult.data = {
      pullRequestTitle: webhook.getPullRequestTitle(),
      pullRequestNumber: webhook.getPullRequestNumber(),
      pullRequestDescription: webhook.getPullRequestDescription(),
      commentId: webhook.getCommentId(),
      commentDescription,
      matches: commentDescription.match(commentRegExp),
    };

    return Promise.resolve(ruleResult);
  }
}
