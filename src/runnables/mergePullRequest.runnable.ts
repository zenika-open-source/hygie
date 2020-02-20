import { Runnable } from './runnable.class';
import { RuleResult } from '../rules/ruleResult';

import { CallbackType } from './runnables.service';
import { RunnableDecorator } from './runnable.decorator';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { GitApiInfos } from '../git/gitApiInfos';
import { GitMergePRInfos, PRMethodsEnum } from '../git/gitPRInfos';
import { GitTypeEnum } from '../webhook/utils.enum';
import { EnvVarAccessor } from '../env-var/env-var.accessor';
import { Utils } from '../utils/utils';
import { AnalyticsDecorator } from '../analytics/analytics.decorator';
import { HYGIE_TYPE } from '../utils/enum';

interface MergePullRequestArgs {
  commitTitle: string;
  commitMessage: string;
  method: string;
  sha: string;
}

/**
 * `MergePullRequestRunnable` merge the PR or MR processed by the previous rule.
 *  @warn Be sure that the rule returned the `pullRequest.number` property in the `RuleResult` object.
 */
@RunnableDecorator('MergePullRequestRunnable')
export class MergePullRequestRunnable extends Runnable {
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
    args: MergePullRequestArgs,
  ): Promise<void> {
    ruleResult.env = this.envVarAccessor.getAllEnvVar();

    const gitApiInfos: GitApiInfos = ruleResult.gitApiInfos;
    const data = ruleResult.data as any;
    const gitMergePRInfos = new GitMergePRInfos();

    gitMergePRInfos.number = data.pullRequest.number;

    if (typeof args !== 'undefined') {
      if (typeof args.commitMessage !== 'undefined') {
        gitMergePRInfos.commitMessage = Utils.render(
          args.commitMessage,
          ruleResult,
        );
      }
      if (typeof args.commitTitle !== 'undefined') {
        gitMergePRInfos.commitTitle = Utils.render(
          args.commitTitle,
          ruleResult,
        );
      }
      if (typeof args.sha !== 'undefined') {
        gitMergePRInfos.sha = Utils.render(args.sha, ruleResult);
      }
      if (typeof args.method !== 'undefined') {
        switch (Utils.render(args.method.toLocaleLowerCase(), ruleResult)) {
          case 'squash':
            gitMergePRInfos.method = PRMethodsEnum.Squash;
            break;
          case 'rebase':
            gitMergePRInfos.method = PRMethodsEnum.Rebase;
            break;
          case 'merge':
          default:
            gitMergePRInfos.method = PRMethodsEnum.Merge;
            break;
        }
      } else {
        gitMergePRInfos.method = PRMethodsEnum.Merge;
      }
    } else {
      // Default
      gitMergePRInfos.method = PRMethodsEnum.Merge;
    }

    if (gitApiInfos.git === GitTypeEnum.Github) {
      this.githubService.mergePullRequest(gitMergePRInfos);
    } else if (gitApiInfos.git === GitTypeEnum.Gitlab) {
      this.gitlabService.mergePullRequest(gitMergePRInfos);
    }
  }
}
