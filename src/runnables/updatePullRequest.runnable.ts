import { Runnable } from './runnable.class';
import { RuleResult } from '../rules/ruleResult';
import { CallbackType } from './runnables.service';
import { RunnableDecorator } from './runnable.decorator';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { GitApiInfos } from '../git/gitApiInfos';
import { GitPRInfos } from '../git/gitPRInfos';
import { GitTypeEnum } from '../webhook/utils.enum';
import { IssuePRStateEnum } from '../git/gitIssueInfos';
import { render } from 'mustache';
import { Inject } from '@nestjs/common';
import { Visitor } from 'universal-analytics';

interface UpdatePullRequestArgs {
  target: string;
  title: string;
  state: string;
  description: string;
}

/**
 * `UpdatePullRequestRunnable` update some PR's properties.
 *  @warn Be sure that the rule returned the `pullRequest.number` property in the `RuleResult` object.
 */
@RunnableDecorator('UpdatePullRequestRunnable')
export class UpdatePullRequestRunnable extends Runnable {
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
    args: UpdatePullRequestArgs,
  ): Promise<void> {
    const gitApiInfos: GitApiInfos = ruleResult.gitApiInfos;
    const data = ruleResult.data as any;
    const gitPRInfos = new GitPRInfos();

    let arrayOfPRNumber: number[] = new Array();

    this.googleAnalytics
      .event('Runnable', 'updatePullRequest', ruleResult.projectURL)
      .send();

    if (typeof data.pullRequest.number === 'number') {
      arrayOfPRNumber.push(data.pullRequest.number);
    } else {
      arrayOfPRNumber = data.pullRequest.number;
    }

    arrayOfPRNumber.forEach(pullRequestNumber => {
      gitPRInfos.number = pullRequestNumber;

      if (typeof args.state !== 'undefined') {
        gitPRInfos.state =
          render(args.state, ruleResult).toLowerCase() === 'open'
            ? IssuePRStateEnum.Open
            : render(args.state, ruleResult).toLowerCase() === 'close'
            ? IssuePRStateEnum.Close
            : IssuePRStateEnum.Undefined;
      }
      if (typeof args.title !== 'undefined') {
        gitPRInfos.title = render(args.title, ruleResult);
      }
      if (typeof args.target !== 'undefined') {
        gitPRInfos.target = render(args.target, ruleResult);
      }
      if (typeof args.description !== 'undefined') {
        gitPRInfos.description = render(args.description, ruleResult);
      }

      if (gitApiInfos.git === GitTypeEnum.Github) {
        this.githubService.updatePullRequest(gitApiInfos, gitPRInfos);
      } else if (gitApiInfos.git === GitTypeEnum.Gitlab) {
        this.gitlabService.updatePullRequest(gitApiInfos, gitPRInfos);
      }
    });
  }
}
