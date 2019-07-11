import { Runnable } from './runnable.class';
import { RuleResult } from '../rules/ruleResult';

import { CallbackType } from './runnables.service';
import { RunnableDecorator } from './runnable.decorator';
import { GitTypeEnum } from '../webhook/utils.enum';
import { GithubService } from '../github/github.service';
import { GitApiInfos } from '../git/gitApiInfos';
import { GitCommit } from '../git/gitCommit';
import { GitRef } from '../git/gitRef';
import { Inject } from '@nestjs/common';
import { Visitor } from 'universal-analytics';
import { EnvVarAccessor } from '../env-var/env-var.accessor';
import { Utils } from '../utils/utils';

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
  constructor(
    private readonly githubService: GithubService,
    @Inject('GoogleAnalytics')
    private readonly googleAnalytics: Visitor,
    private readonly envVarAccessor: EnvVarAccessor,
  ) {
    super();
  }
  async run(
    callbackType: CallbackType,
    ruleResult: RuleResult,
    args: DeployFolderArgs,
  ): Promise<void> {
    ruleResult.env = this.envVarAccessor.getAllEnvVar();

    const gitApiInfos: GitApiInfos = ruleResult.gitApiInfos;
    const sourceBranch: string = (ruleResult.data as any).branch;

    this.googleAnalytics
      .event('Runnable', 'deployFolder', ruleResult.projectURL)
      .send();

    if (
      gitApiInfos.git === GitTypeEnum.Github &&
      typeof args.folder !== 'undefined' &&
      typeof args.branch !== 'undefined'
    ) {
      const folder = Utils.render(args.folder, ruleResult);
      const branch = Utils.render(args.branch, ruleResult);
      const message =
        typeof args.message !== 'undefined'
          ? Utils.render(args.message, ruleResult)
          : `deploy ${folder} to ${branch}`;

      const treeSha: string = await this.githubService.getTree(
        folder,
        sourceBranch,
      );
      const lastCommit = await this.githubService.getLastCommit(branch);
      const gitCommit = new GitCommit();
      gitCommit.tree = treeSha;
      gitCommit.message = message;
      gitCommit.parents = [lastCommit];
      const commitSha: string = await this.githubService.createCommit(
        gitCommit,
      );
      const gitRef = new GitRef();
      gitRef.refName = 'refs/heads/' + branch;
      gitRef.sha = commitSha;
      gitRef.force = false;
      this.githubService.updateRef(gitRef);
    }
  }
}
