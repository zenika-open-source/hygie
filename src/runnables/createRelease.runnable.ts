import { Runnable } from './runnable.class';
import { RuleResult } from '../rules/ruleResult';

import { CallbackType } from './runnables.service';
import { RunnableDecorator } from './runnable.decorator';
import { GitApiInfos } from '../git/gitApiInfos';
import { GitTypeEnum } from '../webhook/utils.enum';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { GitRelease } from '../git/gitRelease';
import { Inject } from '@nestjs/common';
import { Visitor } from 'universal-analytics';
import { EnvVarAccessor } from '../env-var/env-var.accessor';
import { Utils } from '../utils/utils';

interface CreateReleaseArgs {
  name: string;
  tag: string;
  description: string;
  ref: string;
}

/**
 * `CreateReleaseRunnable` generate a `name` release related to a `tag`. You can add a description supporting markdown.
 */
@RunnableDecorator('CreateReleaseRunnable')
export class CreateReleaseRunnable extends Runnable {
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
    args: CreateReleaseArgs,
  ): Promise<void> {
    ruleResult.env = this.envVarAccessor.getAllEnvVar();

    const gitApiInfos: GitApiInfos = ruleResult.gitApiInfos;
    const gitRelease: GitRelease = new GitRelease();

    this.googleAnalytics
      .event('Runnable', 'createRelease', ruleResult.projectURL)
      .send();

    if (typeof args.tag === 'undefined') {
      return;
    }
    gitRelease.tag = Utils.render(args.tag, ruleResult);

    if (typeof args.name !== 'undefined') {
      gitRelease.name = Utils.render(args.name, ruleResult);
    }
    if (typeof args.description !== 'undefined') {
      gitRelease.description = Utils.render(args.description, ruleResult);
    }
    if (typeof args.ref !== 'undefined') {
      gitRelease.ref = Utils.render(args.ref, ruleResult);
    }

    if (gitApiInfos.git === GitTypeEnum.Github) {
      this.githubService.createRelease(gitRelease);
    } else if (gitApiInfos.git === GitTypeEnum.Gitlab) {
      this.gitlabService.createRelease(gitRelease);
    }
  }
}
