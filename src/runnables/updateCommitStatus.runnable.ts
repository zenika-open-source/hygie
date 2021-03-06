import { Runnable } from './runnable.class';
import { RuleResult } from '../rules/ruleResult';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { GitTypeEnum, CommitStatusEnum } from '../webhook/utils.enum';
import { CallbackType } from './runnables.service';
import { GitApiInfos } from '../git/gitApiInfos';
import { GitCommitStatusInfos } from '../git/gitCommitStatusInfos';
import { RunnableDecorator } from './runnable.decorator';
import { Utils } from '../utils/utils';
import { EnvVarAccessor } from '../env-var/env-var.accessor';
import { AnalyticsDecorator } from '../analytics/analytics.decorator';
import { HYGIE_TYPE } from '../utils/enum';

interface UpdateCommitStatusArgs {
  successTargetUrl: string;
  failTargetUrl: string;
  successDescriptionMessage: string;
  failDescriptionMessage: string;
  status: string;
}

/**
 * `UpdateCommitStatusRunnable` updates the commits' status processed by the previous rule.
 * @warn Be sure that the previous rule returned the `commits` property in the `RuleResult` object.
 */
@RunnableDecorator('UpdateCommitStatusRunnable')
export class UpdateCommitStatusRunnable extends Runnable {
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
    args: UpdateCommitStatusArgs,
  ): Promise<void> {
    ruleResult.env = this.envVarAccessor.getAllEnvVar();

    const data = ruleResult.data as any;
    const gitCommitStatusInfos: GitCommitStatusInfos = new GitCommitStatusInfos();
    const gitApiInfos: GitApiInfos = ruleResult.gitApiInfos;

    if (args.status === CommitStatusEnum.Pending) {
      gitCommitStatusInfos.context = '/wip';
      this.updateCommitStatus(gitApiInfos, gitCommitStatusInfos);
      return;
    }

    data.commits.map(c => {
      gitCommitStatusInfos.commitSha = c.sha;
      gitCommitStatusInfos.commitStatus = c.status;

      gitCommitStatusInfos.descriptionMessage = Utils.render(
        c.success
          ? Utils.getStringValue(args.successDescriptionMessage)
          : Utils.getStringValue(args.failDescriptionMessage),
        ruleResult,
      );

      gitCommitStatusInfos.targetUrl = Utils.render(
        c.success
          ? Utils.getStringValue(args.successTargetUrl)
          : Utils.getStringValue(args.failTargetUrl),
        ruleResult,
      );

      this.updateCommitStatus(gitApiInfos, gitCommitStatusInfos);
    });
  }

  private updateCommitStatus(
    gitApiInfos: GitApiInfos,
    gitCommitStatusInfos: GitCommitStatusInfos,
  ) {
    if (gitApiInfos.git === GitTypeEnum.Github) {
      this.githubService.updateCommitStatus(gitCommitStatusInfos);
    } else if (gitApiInfos.git === GitTypeEnum.Gitlab) {
      this.gitlabService.updateCommitStatus(gitCommitStatusInfos);
    }
  }
}
