import { Runnable } from './runnable.class';
import { RuleResult } from '../rules/ruleResult';
import { render } from 'mustache';
import { CallbackType } from './runnables.service';
import { RunnableDecorator } from './runnable.decorator';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { GitApiInfos } from '../git/gitApiInfos';
import { GitFileInfos } from '../git/gitFileInfos';
import { GitTypeEnum } from '../webhook/utils.enum';
import { logger } from '../logger/logger.service';

interface DeleteFilesArgs {
  files: string[];
  message: string;
  branch: string;
}

/**
 * `DeleteFilesRunnable` a set of files.
 */
@RunnableDecorator('DeleteFilesRunnable')
export class DeleteFilesRunnable extends Runnable {
  constructor(
    private readonly githubService: GithubService,
    private readonly gitlabService: GitlabService,
  ) {
    super();
  }

  run(
    callbackType: CallbackType,
    ruleResult: RuleResult,
    args: DeleteFilesArgs,
  ): void {
    const gitApiInfos: GitApiInfos = ruleResult.gitApiInfos;

    args.files.forEach(file => {
      const gitFileInfos = new GitFileInfos();
      if (typeof args.branch !== 'undefined') {
        gitFileInfos.fileBranch = render(args.branch, ruleResult);
      } else {
        // Default
        gitFileInfos.fileBranch = 'master';
      }
      gitFileInfos.commitMessage = render(args.message, ruleResult);
      gitFileInfos.filePath = render(file, ruleResult);

      if (gitApiInfos.git === GitTypeEnum.Github) {
        this.githubService.deleteFile(gitApiInfos, gitFileInfos);
      } else if (gitApiInfos.git === GitTypeEnum.Gitlab) {
        this.gitlabService.deleteFile(gitApiInfos, gitFileInfos);
      }
    });
  }
}
