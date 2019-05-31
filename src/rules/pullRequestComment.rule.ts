import { Rule } from './rule.class';
import { RuleResult } from './ruleResult';
import { GitEventEnum } from '../webhook/utils.enum';
import { Webhook } from '../webhook/webhook';
import { RuleDecorator } from './rule.decorator';

interface PullRequestCommentOptions {
  regexp: string;
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

    const commentDescription = webhook.getCommentDescription();
    const commentRegExp = RegExp(ruleConfig.options.regexp);
    ruleResult.validated = commentRegExp.test(commentDescription);

    ruleResult.data = {
      pullRequestTitle: webhook.getPullRequestTitle(),
      pullRequestNumber: webhook.getPullRequestNumber(),
      pullRequestDescription: webhook.getPullRequestDescription(),
      commentId: webhook.getCommentId(),
      commentDescription,
    };

    return Promise.resolve(ruleResult);
  }
}
