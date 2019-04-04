import { Runnable } from './runnable.class';
import { RuleResult } from '../rules/ruleResult';
import { render } from 'mustache';
import { CallbackType } from './runnables.service';
import { RunnableDecorator } from './runnable.decorator';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { GitApiInfos } from '../git/gitApiInfos';
import { GitTypeEnum } from '../webhook/utils.enum';

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
  ) {
    super();
  }

  run(
    callbackType: CallbackType,
    ruleResult: RuleResult,
    args: DeleteBranchArgs,
  ): void {
    const gitApiInfos: GitApiInfos = ruleResult.gitApiInfos;
    let branchName: string;
    // Defaults
    if (
      typeof args === 'undefined' ||
      (typeof args !== 'undefined' && typeof args.branchName === 'undefined')
    ) {
      branchName = (ruleResult as any).data.branch;
    } else {
      branchName = render(args.branchName, ruleResult);
    }

    if (gitApiInfos.git === GitTypeEnum.Github) {
      this.githubService.deleteBranch(gitApiInfos, branchName);
    } else if (gitApiInfos.git === GitTypeEnum.Gitlab) {
      this.gitlabService.deleteBranch(gitApiInfos, branchName);
    }
  }
}
