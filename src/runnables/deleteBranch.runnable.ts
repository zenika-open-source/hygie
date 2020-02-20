import { Runnable } from './runnable.class';
import { RuleResult } from '../rules/ruleResult';

import { CallbackType } from './runnables.service';
import { RunnableDecorator } from './runnable.decorator';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { GitApiInfos } from '../git/gitApiInfos';
import { GitTypeEnum } from '../webhook/utils.enum';
import { EnvVarAccessor } from '../env-var/env-var.accessor';
import { Utils } from '../utils/utils';
import { AnalyticsDecorator } from '../analytics/analytics.decorator';
import { HYGIE_TYPE } from '../utils/enum';

interface DeleteBranchArgs {
  branchName?: string;
}

/**
 * `DeleteBranchRunnable` delete a particular branch.
 */
@RunnableDecorator('DeleteBranchRunnable')
export class DeleteBranchRunnable extends Runnable {
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
    args: DeleteBranchArgs,
  ): Promise<void> {
    ruleResult.env = this.envVarAccessor.getAllEnvVar();

    const gitApiInfos: GitApiInfos = ruleResult.gitApiInfos;
    let branchName: string;

    // Defaults
    if (
      typeof args === 'undefined' ||
      (typeof args !== 'undefined' && typeof args.branchName === 'undefined')
    ) {
      branchName = (ruleResult as any).data.branchBranch;
    } else {
      branchName = Utils.render(args.branchName, ruleResult);
    }

    if (gitApiInfos.git === GitTypeEnum.Github) {
      this.githubService.deleteBranch(branchName);
    } else if (gitApiInfos.git === GitTypeEnum.Gitlab) {
      this.gitlabService.deleteBranch(branchName);
    }
  }
}
