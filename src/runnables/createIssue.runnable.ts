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
import { logger } from '../logger/logger.service';

interface CreateIssueArgs {
  title: string;
  description: string;
  assignees: string[];
  labels: string[];
}

/**
 * `CreateIssueRunnable` create an issue the specified `CreateIssueArgs` params.
 */
@RunnableDecorator('CreateIssueRunnable')
export class CreateIssueRunnable extends Runnable {
  constructor(
    private readonly githubService: GithubService,
    private readonly gitlabService: GitlabService,
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

    if (typeof args.description !== 'undefined') {
      gitIssueInfos.description = render(args.description, ruleResult);
    }

    if (typeof args.labels !== 'undefined') {
      gitIssueInfos.labels = args.labels;
    }

    if (typeof args.assignees !== 'undefined') {
      gitIssueInfos.assignees = args.assignees;
    }

    if (gitApiInfos.git === GitTypeEnum.Github) {
      this.githubService.createIssue(gitApiInfos, gitIssueInfos);
    } else if (gitApiInfos.git === GitTypeEnum.Gitlab) {
      this.gitlabService.createIssue(gitApiInfos, gitIssueInfos);
    }
  }
}
