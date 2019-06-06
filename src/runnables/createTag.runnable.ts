import { Runnable } from './runnable.class';
import { RuleResult } from '../rules/ruleResult';
import { render } from 'mustache';
import { CallbackType } from './runnables.service';
import { RunnableDecorator } from './runnable.decorator';
import { Utils } from '../rules/utils';
import { logger } from '../logger/logger.service';
import { GitApiInfos } from '../git/gitApiInfos';
import { GitTypeEnum } from '../webhook/utils.enum';
import { GitlabService } from '../gitlab/gitlab.service';
import { GithubService } from '../github/github.service';
import { GitTag } from '../git/gitTag';
import { GitRef } from '../git/gitRef';

interface CreateTagArgs {
  tag: string;
  message: string;
}

/**
 * `CreateTagRunnable` creates a Tag Object with custom `tag` name and `message`.
 * @warn make sure that the previous rule return a `commitSha`
 */
@RunnableDecorator('CreateTagRunnable')
export class CreateTagRunnable extends Runnable {
  constructor(
    private readonly githubService: GithubService,
    private readonly gitlabService: GitlabService,
  ) {
    super();
  }

  async run(
    callbackType: CallbackType,
    ruleResult: RuleResult,
    args: CreateTagArgs,
  ): Promise<void> {
    const data = ruleResult.data as any;
    const gitApiInfos: GitApiInfos = ruleResult.gitApiInfos;

    const lastItem = Utils.getLastItem(data.commits);

    if (typeof lastItem === 'undefined') {
      return;
    }

    const lastSha = lastItem.sha;

    const tag = render(args.tag, ruleResult);

    const semVerRegexp = new RegExp(
      // tslint:disable-next-line:max-line-length
      /^v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(-(0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(\.(0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*)?(\+[0-9a-zA-Z-]+(\.[0-9a-zA-Z-]+)*)?$/,
    );

    if (!semVerRegexp.test(tag)) {
      logger.error(`${tag} is not a correct tag name!`, {
        location: 'CreateTagRunnable',
      });
      return;
    }

    const gitTag = new GitTag();
    if (typeof args.message !== 'undefined') {
      gitTag.message = render(args.message, ruleResult);
    } else {
      gitTag.message = 'version ' + tag;
    }
    gitTag.tag = tag;
    gitTag.sha = lastSha;
    gitTag.type = 'commit';

    if (gitApiInfos.git === GitTypeEnum.Github) {
      const gitRef = new GitRef();
      const sha = await this.githubService.createTag(gitApiInfos, gitTag);
      gitRef.sha = sha;
      gitRef.refName = 'refs/tags/' + gitTag.tag;
      this.githubService.createRef(gitApiInfos, gitRef);
    } else if (gitApiInfos.git === GitTypeEnum.Gitlab) {
      this.gitlabService.createTag(gitApiInfos, gitTag);
    }
  }
}