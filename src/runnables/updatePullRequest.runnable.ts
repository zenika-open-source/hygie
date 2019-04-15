import { Runnable } from './runnable.class';
import { RuleResult } from '../rules/ruleResult';
import { render } from 'mustache';
import { CallbackType } from './runnables.service';
import { RunnableDecorator } from './runnable.decorator';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { GitApiInfos } from '../git/gitApiInfos';
import { GitPRInfos } from '../git/gitPRInfos';
import { GitTypeEnum } from '../webhook/utils.enum';
import { IssuePRStateEnum } from '../git/gitIssueInfos';

interface UpdatePullRequestArgs {
  target: string;
  title: string;
  state: string;
  description: string;
}

/**
 * `UpdatePullRequestRunnable` update some PR's properties.
 *  @warn Be sure that the rule returned the `pullRequestNumber` property in the `RuleResult` object.
 */
@RunnableDecorator('UpdatePullRequestRunnable')
export class UpdatePullRequestRunnable extends Runnable {
  constructor(
    private readonly githubService: GithubService,
    private readonly gitlabService: GitlabService,
  ) {
    super();
  }

  run(
    callbackType: CallbackType,
    ruleResult: RuleResult,
    args: UpdatePullRequestArgs,
  ): void {
    const gitApiInfos: GitApiInfos = ruleResult.gitApiInfos;
    const data = ruleResult.data as any;
    const gitPRInfos = new GitPRInfos();

    gitPRInfos.number = data.pullRequestNumber;

    if (typeof args.state !== 'undefined') {
      gitPRInfos.state =
        args.state.toLowerCase() === 'open'
          ? IssuePRStateEnum.Open
          : args.state.toLowerCase() === 'close'
          ? IssuePRStateEnum.Close
          : IssuePRStateEnum.Undefined;
    }
    if (typeof args.title !== 'undefined') {
      gitPRInfos.title = args.title;
    }
    if (typeof args.target !== 'undefined') {
      gitPRInfos.target = args.target;
    }
    if (typeof args.description !== 'undefined') {
      gitPRInfos.description = args.description;
    }

    if (gitApiInfos.git === GitTypeEnum.Github) {
      this.githubService.updatePullRequest(gitApiInfos, gitPRInfos);
    } else if (gitApiInfos.git === GitTypeEnum.Gitlab) {
      this.gitlabService.updatePullRequest(gitApiInfos, gitPRInfos);
    }
  }
}
