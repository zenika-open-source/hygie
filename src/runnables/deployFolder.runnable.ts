import { Runnable } from './runnable.class';
import { RuleResult } from '../rules/ruleResult';
import { render } from 'mustache';
import { CallbackType } from './runnables.service';
import { RunnableDecorator } from './runnable.decorator';
import { GitTypeEnum } from '../webhook/utils.enum';
import { GithubService } from '../github/github.service';
import { GitApiInfos } from '../git/gitApiInfos';
import { GitCommit } from '../git/gitCommit';
import { GitRef } from '../git/gitRef';

interface DeployFolderArgs {
  folder: string;
  branch: string;
  message: string;
}

/**
 * `DeployFolderRunnable` allows you to deploy `folder` into `branch` with a custom commit `message`.
 * @warning only available on Github
 */
@RunnableDecorator('DeployFolderRunnable')
export class DeployFolderRunnable extends Runnable {
  constructor(private readonly githubService: GithubService) {
    super();
  }
  async run(
    callbackType: CallbackType,
    ruleResult: RuleResult,
    args: DeployFolderArgs,
  ): Promise<void> {
    const gitApiInfos: GitApiInfos = ruleResult.gitApiInfos;

    if (
      gitApiInfos.git === GitTypeEnum.Github &&
      typeof args.folder !== 'undefined' &&
      typeof args.branch !== 'undefined'
    ) {
      const folder = render(args.folder, ruleResult);
      const branch = render(args.branch, ruleResult);
      const message =
        typeof args.message !== 'undefined'
          ? render(args.message, ruleResult)
          : `deploy ${folder} to ${branch}`;

      const treeSha: string = await this.githubService.getTree(
        gitApiInfos,
        folder,
      );
      const lastCommit = await this.githubService.getLastCommit(
        gitApiInfos,
        branch,
      );
      const gitCommit = new GitCommit();
      gitCommit.tree = treeSha;
      gitCommit.message = message;
      gitCommit.parents = [lastCommit];
      const commitSha: string = await this.githubService.createCommit(
        gitApiInfos,
        gitCommit,
      );
      const gitRef = new GitRef();
      gitRef.refName = 'refs/heads/' + branch;
      gitRef.sha = commitSha;
      gitRef.force = false;
      this.githubService.updateRef(gitApiInfos, gitRef);
    }
  }
}
