import { Runnable } from './runnable.class';
import { RuleResult } from '../rules/ruleResult';
import { CallbackType } from './runnables.service';
import { RunnableDecorator } from './runnable.decorator';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { GitApiInfos } from '../git/gitApiInfos';
import { GitTypeEnum } from '../webhook/utils.enum';
import { IssuePRStateEnum, GitIssueInfos } from '../git/gitIssueInfos';

import { Utils } from '../utils/utils';
import { Inject } from '@nestjs/common';
import { Visitor } from 'universal-analytics';
import { EnvVarAccessor } from '../env-var/env-var.accessor';

interface UpdateIssueArgs {
  state: string;
  labels: string | string[];
}

/**
 * `UpdateIssueRunnable` update some issue's properties.
 *  @warn Be sure that the rule returned the `issue.number` property in the `RuleResult` object.
 */
@RunnableDecorator('UpdateIssueRunnable')
export class UpdateIssueRunnable extends Runnable {
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
    args: UpdateIssueArgs,
  ): Promise<void> {
    ruleResult.env = this.envVarAccessor.getAllEnvVar();

    const data = ruleResult.data as any;
    const gitApiInfos: GitApiInfos = ruleResult.gitApiInfos;
    const gitIssueInfos: GitIssueInfos = new GitIssueInfos();
    let arrayOfIssueNumber: number[] = new Array();

    this.googleAnalytics
      .event('Runnable', 'updateIssue', ruleResult.projectURL)
      .send();

    if (typeof data.issue.number === 'number') {
      arrayOfIssueNumber.push(data.issue.number);
    } else {
      arrayOfIssueNumber = data.issue.number;
    }

    arrayOfIssueNumber.forEach(issueNumber => {
      gitIssueInfos.number = issueNumber.toString();

      if (typeof args.state !== 'undefined') {
        gitIssueInfos.state =
          Utils.render(args.state, ruleResult).toLowerCase() === 'open'
            ? IssuePRStateEnum.Open
            : Utils.render(args.state, ruleResult).toLowerCase() === 'close'
            ? IssuePRStateEnum.Close
            : IssuePRStateEnum.Undefined;
      }

      if (typeof args.labels !== 'undefined') {
        gitIssueInfos.labels = Utils.transformToArray(args.labels, ruleResult);
      }

      if (gitApiInfos.git === GitTypeEnum.Github) {
        this.githubService.updateIssue(gitIssueInfos);
      } else if (gitApiInfos.git === GitTypeEnum.Gitlab) {
        this.gitlabService.updateIssue(gitIssueInfos);
      }
    });
  }
}
