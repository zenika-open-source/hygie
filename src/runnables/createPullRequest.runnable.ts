import { Runnable } from './runnable.class';
import { RuleResult } from '../rules/ruleResult';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { GitTypeEnum } from '../webhook/utils.enum';
import { GitPRInfos } from '../git/gitPRInfos';
import { render } from 'mustache';
import { CallbackType } from './runnables.service';
import { GitApiInfos } from '../git/gitApiInfos';
import { RunnableDecorator } from './runnable.decorator';

interface CreatePullRequestArgs {
  title: string;
  description: string;
  source: string;
  target: string;
}

/**
 * `CreatePullRequestRunnable` creates a new PR or MR.
 */
@RunnableDecorator('CreatePullRequestRunnable')
export class CreatePullRequestRunnable extends Runnable {
  constructor(
    private readonly githubService: GithubService,
    private readonly gitlabService: GitlabService,
  ) {
    super();
  }

  run(
    callbackType: CallbackType,
    ruleResult: RuleResult,
    args: CreatePullRequestArgs,
  ): void {
    const gitApiInfos: GitApiInfos = ruleResult.gitApiInfos;

    const gitCreatePRInfos: GitPRInfos = new GitPRInfos();

    // Defaults
    if (typeof args.description === 'undefined') {
      args.description = '';
    }
    if (typeof args.source === 'undefined') {
      args.source = '{{data.branch}}';
    }
    if (typeof args.target === 'undefined') {
      args.target = 'master';
    }

    gitCreatePRInfos.description = render(args.description, ruleResult);
    gitCreatePRInfos.title = render(args.title, ruleResult);
    gitCreatePRInfos.source = render(args.source, ruleResult);
    gitCreatePRInfos.target = render(args.target, ruleResult);

    if (gitApiInfos.git === GitTypeEnum.Github) {
      this.githubService.createPullRequest(gitApiInfos, gitCreatePRInfos);
    } else if (gitApiInfos.git === GitTypeEnum.Gitlab) {
      this.gitlabService.createPullRequest(gitApiInfos, gitCreatePRInfos);
    }
  }
}
