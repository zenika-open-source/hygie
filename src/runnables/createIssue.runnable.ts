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
import { Logger } from '@nestjs/common';
import { EnvVarAccessor } from '../env-var/env-var.accessor';
import { AnalyticsDecorator } from '../analytics/analytics.decorator';
import { HYGIE_TYPE } from '../utils/enum';

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
    private readonly envVarAccessor: EnvVarAccessor,
  ) {
    super();
  }

  @AnalyticsDecorator(HYGIE_TYPE.RUNNABLE)
  async run(
    callbackType: CallbackType,
    ruleResult: RuleResult,
    args: CreateIssueArgs,
  ): Promise<void> {
    ruleResult.env = this.envVarAccessor.getAllEnvVar();

    const gitApiInfos: GitApiInfos = ruleResult.gitApiInfos;
    const gitIssueInfos: GitIssueInfos = new GitIssueInfos();
    gitIssueInfos.title = Utils.render(args.title, ruleResult);

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
