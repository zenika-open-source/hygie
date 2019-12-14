import { Runnable } from './runnable.class';
import { RuleResult } from '../rules/ruleResult';
import { CallbackType } from './runnables.service';
import { RunnableDecorator } from './runnable.decorator';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { GitApiInfos } from '../git/gitApiInfos';
import { GitIssueInfos } from '../git/gitIssueInfos';
import { GitTypeEnum } from '../webhook/utils.enum';
import { Utils } from '../utils/utils';
import { Inject, Logger } from '@nestjs/common';
import { Visitor } from 'universal-analytics';
import { EnvVarAccessor } from '../env-var/env-var.accessor';

interface CreateIssueArgs {
  title: string;
  description: string;
  assignees: string | string[];
  labels: string | string[];
}

/**
 * `CreateIssueRunnable` create an issue with the specified `CreateIssueArgs` params.
 */
@RunnableDecorator('CreateIssueRunnable')
export class CreateIssueRunnable extends Runnable {
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
    args: CreateIssueArgs,
  ): Promise<void> {
    ruleResult.env = this.envVarAccessor.getAllEnvVar();

    const gitApiInfos: GitApiInfos = ruleResult.gitApiInfos;
    const gitIssueInfos: GitIssueInfos = new GitIssueInfos();
    gitIssueInfos.title = Utils.render(args.title, ruleResult);

    this.googleAnalytics
      .event('Runnable', 'createIssue', ruleResult.projectURL)
      .send();

    if (typeof args.description !== 'undefined') {
      gitIssueInfos.description = Utils.render(args.description, ruleResult);
    }

    if (typeof args.labels !== 'undefined') {
      gitIssueInfos.labels = Utils.transformToArray(args.labels, ruleResult);
    }

    if (typeof args.assignees !== 'undefined') {
      gitIssueInfos.assignees = Utils.transformToArray(
        args.assignees,
        ruleResult,
      );
    }

    if (gitApiInfos.git === GitTypeEnum.Github) {
      this.githubService
        .createIssue(gitIssueInfos)
        .catch(err => Logger.error(err));
    } else if (gitApiInfos.git === GitTypeEnum.Gitlab) {
      this.gitlabService
        .createIssue(gitIssueInfos)
        .catch(err => Logger.error(err));
    }
  }
}
