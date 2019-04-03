import { Runnable } from './runnable.class';
import { RuleResult } from '../rules/ruleResult';
import { render } from 'mustache';
import { CallbackType } from './runnables.service';
import { RunnableDecorator } from './runnable.decorator';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { GitApiInfos } from '../git/gitApiInfos';
import { GitTypeEnum } from '../webhook/utils.enum';
import { IssueStateEnum, GitIssueInfos } from '../git/gitIssueInfos';

interface UpdateIssueArgs {
  state: string;
}

/**
 * `UpdateIssueRunnable` update some issue's properties.
 *  @warn Be sure that the rule returned the `issueNumber` property in the `RuleResult` object.
 */
@RunnableDecorator('UpdateIssueRunnable')
export class UpdateIssueRunnable extends Runnable {
  constructor(
    private readonly githubService: GithubService,
    private readonly gitlabService: GitlabService,
  ) {
    super();
  }

  run(
    callbackType: CallbackType,
    ruleResult: RuleResult,
    args: UpdateIssueArgs,
  ): void {
    const data = ruleResult.data as any;
    const gitApiInfos: GitApiInfos = ruleResult.gitApiInfos;
    const gitIssueInfos: GitIssueInfos = new GitIssueInfos();
    gitIssueInfos.number = data.issueNumber;

    if (typeof args.state !== 'undefined') {
      gitIssueInfos.state =
        args.state.toLowerCase() === 'open'
          ? IssueStateEnum.Open
          : args.state.toLowerCase() === 'close'
          ? IssueStateEnum.Close
          : IssueStateEnum.Undefined;
    }

    if (gitApiInfos.git === GitTypeEnum.Github) {
      this.githubService.updateIssue(gitApiInfos, gitIssueInfos);
    } else if (gitApiInfos.git === GitTypeEnum.Gitlab) {
      this.gitlabService.updateIssue(gitApiInfos, gitIssueInfos);
    }
  }
}
