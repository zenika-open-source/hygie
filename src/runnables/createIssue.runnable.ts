import { Runnable } from './runnable.class';
import { RuleResult } from '../rules/ruleResult';
import { render } from 'mustache';
import { CallbackType } from './runnables.service';
import { RunnableDecorator } from './runnable.decorator';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { GitApiInfos } from '../git/gitApiInfos';
import { GitIssueInfos } from '../git/gitIssueInfos';
import { GitTypeEnum } from '../webhook/utils.enum';
import { Utils } from '../utils/utils';
import { Inject } from '@nestjs/common';
import { Visitor } from 'universal-analytics';
import { logger } from '../logger/logger.service';

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
  ) {
    super();
  }
  async run(
    callbackType: CallbackType,
    ruleResult: RuleResult,
    args: CreateIssueArgs,
  ): Promise<void> {
    const gitApiInfos: GitApiInfos = ruleResult.gitApiInfos;
    const gitIssueInfos: GitIssueInfos = new GitIssueInfos();
    gitIssueInfos.title = render(args.title, ruleResult);

    this.googleAnalytics
      .event('Runnable', 'createIssue', ruleResult.projectURL)
      .send();

    if (typeof args.description !== 'undefined') {
      gitIssueInfos.description = render(args.description, ruleResult);
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
        .catch(err => logger.error(err));
    } else if (gitApiInfos.git === GitTypeEnum.Gitlab) {
      this.gitlabService
        .createIssue(gitIssueInfos)
        .catch(err => logger.error(err));
    }
  }
}
