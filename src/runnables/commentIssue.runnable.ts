import { Runnable } from './runnable.class';
import { RuleResult } from '../rules/ruleResult';
import { GitIssueInfos } from '../git/gitIssueInfos';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { GitTypeEnum } from '../webhook/utils.enum';
import { CallbackType } from './runnables.service';
import { GitApiInfos } from '../git/gitApiInfos';
import { RunnableDecorator } from './runnable.decorator';

import { EnvVarAccessor } from '../env-var/env-var.accessor';
import { Utils } from '../utils/utils';
import { AnalyticsDecorator } from '../analytics/analytics.decorator';
import { HYGIE_TYPE } from '../utils/enum';

interface CommentIssueArgs {
  comment: string;
}

/**
 * `CommentIssueRunnable` comments the Issue processed by the previous rule.
 * @warn Be sure that the rule returned the `issue.number` property in the `RuleResult` object.
 */
@RunnableDecorator('CommentIssueRunnable')
export class CommentIssueRunnable extends Runnable {
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
    args: CommentIssueArgs,
  ): Promise<void> {
    const data = ruleResult.data as any;
    ruleResult.env = this.envVarAccessor.getAllEnvVar();

    const gitIssueInfos: GitIssueInfos = new GitIssueInfos();
    gitIssueInfos.number = data.issue.number;
    gitIssueInfos.comment = Utils.render(args.comment, ruleResult);
    const gitApiInfos: GitApiInfos = ruleResult.gitApiInfos;

    if (gitApiInfos.git === GitTypeEnum.Github) {
      this.githubService.addIssueComment(gitIssueInfos);
    } else if (gitApiInfos.git === GitTypeEnum.Gitlab) {
      this.gitlabService.addIssueComment(gitIssueInfos);
    }
  }
}
