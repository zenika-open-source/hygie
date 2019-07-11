import { Runnable } from './runnable.class';
import { RuleResult } from '../rules/ruleResult';

import { CallbackType } from './runnables.service';
import { RunnableDecorator } from './runnable.decorator';
import { Utils } from '../rules/utils';
import { Utils as UtilsGeneral } from '../utils/utils';
import { logger } from '../logger/logger.service';
import { GitApiInfos } from '../git/gitApiInfos';
import { GitTypeEnum } from '../webhook/utils.enum';
import { GitlabService } from '../gitlab/gitlab.service';
import { GithubService } from '../github/github.service';
import { GitTag } from '../git/gitTag';
import { GitRef } from '../git/gitRef';
import { Inject } from '@nestjs/common';
import { Visitor } from 'universal-analytics';
import { EnvVarAccessor } from '../env-var/env-var.accessor';

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
    @Inject('GoogleAnalytics')
    private readonly googleAnalytics: Visitor,
    private readonly envVarAccessor: EnvVarAccessor,
  ) {
    super();
  }

  async run(
    callbackType: CallbackType,
    ruleResult: RuleResult,
    args: CreateTagArgs,
  ): Promise<void> {
    const data = ruleResult.data as any;
    ruleResult.env = this.envVarAccessor.getAllEnvVar();

    const gitApiInfos: GitApiInfos = ruleResult.gitApiInfos;

    this.googleAnalytics
      .event('Runnable', 'createTag', ruleResult.projectURL)
      .send();

    const lastItem = Utils.getLastItem(data.commits);

    if (typeof lastItem === 'undefined') {
      return;
    }

    const lastSha = lastItem.sha;

    const tag = UtilsGeneral.render(args.tag, ruleResult);

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
      gitTag.message = UtilsGeneral.render(args.message, ruleResult);
    } else {
      gitTag.message = 'version ' + tag;
    }
    gitTag.tag = tag;
    gitTag.sha = lastSha;
    gitTag.type = 'commit';

    if (gitApiInfos.git === GitTypeEnum.Github) {
      const gitRef = new GitRef();
      const sha = await this.githubService.createTag(gitTag);
      gitRef.sha = sha;
      gitRef.refName = 'refs/tags/' + gitTag.tag;
      this.githubService.createRef(gitRef);
    } else if (gitApiInfos.git === GitTypeEnum.Gitlab) {
      this.gitlabService.createTag(gitTag);
    }
  }
}
