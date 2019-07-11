import { Runnable } from './runnable.class';
import { RuleResult } from '../rules/ruleResult';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { GitTypeEnum } from '../webhook/utils.enum';
import { CallbackType } from './runnables.service';
import { GitApiInfos } from '../git/gitApiInfos';
import { GitCommitStatusInfos } from '../git/gitCommitStatusInfos';
import { RunnableDecorator } from './runnable.decorator';
import { Utils } from '../utils/utils';

import { Inject } from '@nestjs/common';
import { Visitor } from 'universal-analytics';
import { EnvVarAccessor } from '../env-var/env-var.accessor';

interface UpdateCommitStatusArgs {
  successTargetUrl: string;
  failTargetUrl: string;
  successDescriptionMessage: string;
  failDescriptionMessage: string;
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
    @Inject('GoogleAnalytics')
    private readonly googleAnalytics: Visitor,
    private readonly envVarAccessor: EnvVarAccessor,
  ) {
    super();
  }
  async run(
    callbackType: CallbackType,
    ruleResult: RuleResult,
    args: UpdateCommitStatusArgs,
  ): Promise<void> {
    ruleResult.env = this.envVarAccessor.getAllEnvVar();

    this.googleAnalytics
      .event('Runnable', 'updateCommitStatus', ruleResult.projectURL)
      .send();

    const data = ruleResult.data as any;
    const gitCommitStatusInfos: GitCommitStatusInfos = new GitCommitStatusInfos();
    const gitApiInfos: GitApiInfos = ruleResult.gitApiInfos;

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

      if (gitApiInfos.git === GitTypeEnum.Github) {
        this.githubService.updateCommitStatus(gitCommitStatusInfos);
      } else if (gitApiInfos.git === GitTypeEnum.Gitlab) {
        this.gitlabService.updateCommitStatus(gitCommitStatusInfos);
      }
    });
  }
}
