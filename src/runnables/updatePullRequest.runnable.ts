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
import { EnvVarAccessor } from '../env-var/env-var.accessor';
import { Utils } from '../utils/utils';
import { AnalyticsDecorator } from '../analytics/analytics.decorator';
import { HYGIE_TYPE } from '../utils/enum';

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
    private readonly envVarAccessor: EnvVarAccessor,
  ) {
    super();
  }

  @AnalyticsDecorator(HYGIE_TYPE.RUNNABLE)
  async run(
    callbackType: CallbackType,
    ruleResult: RuleResult,
    args: UpdatePullRequestArgs,
  ): Promise<void> {
    ruleResult.env = this.envVarAccessor.getAllEnvVar();

    const gitApiInfos: GitApiInfos = ruleResult.gitApiInfos;
    const data = ruleResult.data as any;
    const gitPRInfos = new GitPRInfos();

    let arrayOfPRNumber: number[] = new Array();

    if (typeof data.pullRequest.number === 'number') {
      arrayOfPRNumber.push(data.pullRequest.number);
    } else {
      arrayOfPRNumber = data.pullRequest.number;
    }

    arrayOfPRNumber.forEach(pullRequestNumber => {
      gitPRInfos.number = pullRequestNumber;

      if (typeof args.state !== 'undefined') {
        gitPRInfos.state =
          Utils.render(args.state, ruleResult).toLowerCase() === 'open'
            ? IssuePRStateEnum.Open
            : Utils.render(args.state, ruleResult).toLowerCase() === 'close'
            ? IssuePRStateEnum.Close
            : IssuePRStateEnum.Undefined;
      }
      if (typeof args.title !== 'undefined') {
        gitPRInfos.title = Utils.render(args.title, ruleResult);
      }
      if (typeof args.target !== 'undefined') {
        gitPRInfos.target = Utils.render(args.target, ruleResult);
      }
      if (typeof args.description !== 'undefined') {
        gitPRInfos.description = Utils.render(args.description, ruleResult);
      }

      if (gitApiInfos.git === GitTypeEnum.Github) {
        this.githubService.updatePullRequest(gitPRInfos);
      } else if (gitApiInfos.git === GitTypeEnum.Gitlab) {
        this.gitlabService.updatePullRequest(gitPRInfos);
      }
    });
  }
}
