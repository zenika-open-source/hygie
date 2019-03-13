import { Runnable } from './runnable.class';
import { RuleResult } from '../rules/ruleResult';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { GitTypeEnum } from '../webhook/utils.enum';
import { CallbackType } from './runnables.service';
import { GitApiInfos } from '../git/gitApiInfos';
import { GitCommitStatusInfos } from '../git/gitCommitStatusInfos';
import { getStringValue } from '../utils/convert.utils';
import { RunnableDecorator } from './runnable.decorator';

interface UpdateCommitStatusArgs {
  successTargetUrl: string;
  failTargetUrl: string;
  successDescriptionMessage: string;
  failDescriptionMessage: string;
}

@RunnableDecorator('UpdateCommitStatusRunnable')
export class UpdateCommitStatusRunnable extends Runnable {
  constructor(
    private readonly githubService: GithubService,
    private readonly gitlabService: GitlabService,
  ) {
    super();
  }
  run(
    callbackType: CallbackType,
    ruleResult: RuleResult,
    args: UpdateCommitStatusArgs,
  ): void {
    const data = ruleResult.data as any;
    const gitCommitStatusInfos: GitCommitStatusInfos = new GitCommitStatusInfos();
    const gitApiInfos: GitApiInfos = ruleResult.gitApiInfos;

    data.commits.map(c => {
      gitCommitStatusInfos.commitSha = c.sha;
      gitCommitStatusInfos.commitStatus = c.status;

      gitCommitStatusInfos.descriptionMessage = c.success
        ? getStringValue(args.successDescriptionMessage)
        : getStringValue(args.failDescriptionMessage);

      gitCommitStatusInfos.targetUrl = c.success
        ? getStringValue(args.successTargetUrl)
        : getStringValue(args.failTargetUrl);

      if (gitApiInfos.git === GitTypeEnum.Github) {
        this.githubService.updateCommitStatus(
          gitApiInfos,
          gitCommitStatusInfos,
        );
      } else if (gitApiInfos.git === GitTypeEnum.Gitlab) {
        this.gitlabService.updateCommitStatus(
          gitApiInfos,
          gitCommitStatusInfos,
        );
      }
    });
  }
}
