import { Runnable } from './runnable.class';
import { RuleResult } from '../rules/ruleResult';
import { GitIssueInfos } from '../git/gitIssueInfos';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { GitTypeEnum } from '../webhook/utils.enum';
import { CallbackType } from './runnables.service';
import { GitApiInfos } from '../git/gitApiInfos';
import { RunnableDecorator } from './runnable.decorator';
import { render } from 'mustache';
import { Inject } from '@nestjs/common';
import { Visitor } from 'universal-analytics';

interface CommentIssueArgs {
  comment: string;
}

/**
 * `CommentIssueRunnable` comments the Issue processed by the previous rule.
 * @warn Be sure that the rule returned the `issue.number` property in the `RuleResult` object.
 */
@RunnableDecorator('CommentIssueRunnable')
export class CommentIssueRunnable extends Runnable {
  constructor(
    private readonly githubService: GithubService,
    private readonly gitlabService: GitlabService,
    @Inject('GoogleAnalytics')
    private readonly googleAnalytics: Visitor,
  ) {
    super();
  }
  async run(
    callbackType: CallbackType,
    ruleResult: RuleResult,
    args: CommentIssueArgs,
  ): Promise<void> {
    const data = ruleResult.data as any;
    const gitIssueInfos: GitIssueInfos = new GitIssueInfos();
    gitIssueInfos.number = data.issue.number;
    gitIssueInfos.comment = render(args.comment, ruleResult);
    const gitApiInfos: GitApiInfos = ruleResult.gitApiInfos;

    this.googleAnalytics
      .event('Runnable', 'commentIssue', ruleResult.projectURL)
      .send();

    if (gitApiInfos.git === GitTypeEnum.Github) {
      this.githubService.addIssueComment(gitIssueInfos);
    } else if (gitApiInfos.git === GitTypeEnum.Gitlab) {
      this.gitlabService.addIssueComment(gitIssueInfos);
    }
  }
}
