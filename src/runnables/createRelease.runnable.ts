import { Runnable } from './runnable.class';
import { RuleResult } from '../rules/ruleResult';
import { render } from 'mustache';
import { CallbackType } from './runnables.service';
import { RunnableDecorator } from './runnable.decorator';
import { GitApiInfos } from '../git/gitApiInfos';
import { GitTypeEnum } from '../webhook/utils.enum';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { GitRelease } from '../git/gitRelease';

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
  ) {
    super();
  }

  async run(
    callbackType: CallbackType,
    ruleResult: RuleResult,
    args: CreateReleaseArgs,
  ): Promise<void> {
    const gitApiInfos: GitApiInfos = ruleResult.gitApiInfos;
    const gitRelease: GitRelease = new GitRelease();
    gitRelease.tag = args.tag;

    if (typeof args.name !== 'undefined') {
      gitRelease.name = args.name;
    }
    if (typeof args.description !== 'undefined') {
      gitRelease.description = args.description;
    }
    if (typeof args.ref !== 'undefined') {
      gitRelease.ref = args.ref;
    }

    if (gitApiInfos.git === GitTypeEnum.Github) {
      this.githubService.createRelease(gitApiInfos, gitRelease);
    } else if (gitApiInfos.git === GitTypeEnum.Gitlab) {
      this.gitlabService.createRelease(gitApiInfos, gitRelease);
    }
  }
}
