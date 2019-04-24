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

interface DeleteFilesArgs {
  files: string[] | string;
  message: string;
  branch: string;
}

/**
 * `DeleteFilesRunnable` delete a set of files.
 */
@RunnableDecorator('DeleteFilesRunnable')
export class DeleteFilesRunnable extends Runnable {
  constructor(
    private readonly githubService: GithubService,
    private readonly gitlabService: GitlabService,
  ) {
    super();
  }

  async run(
    callbackType: CallbackType,
    ruleResult: RuleResult,
    args: DeleteFilesArgs,
  ): Promise<void> {
    const gitApiInfos: GitApiInfos = ruleResult.gitApiInfos;

    let filesList: string[];

    // Default
    if (typeof args !== 'undefined' && typeof args.message === 'undefined') {
      args.message = 'removing file';
    }

    if (typeof args !== 'undefined' && typeof args.files !== 'undefined') {
      if (typeof args.files === 'string') {
        filesList = render(args.files, ruleResult);
      } else {
        filesList = args.files;
      }

      filesList = filesList
        .toString()
        .replace(/&#x2F;/g, '/')
        .split(',')
        .filter(f => f !== '');
    } else {
      if (typeof (ruleResult as any).data.addedFiles !== 'undefined') {
        filesList = (ruleResult as any).data.addedFiles;
      }
    }

    for (let index = 0; index < filesList.length; index++) {
      // Need a for loop because Async/Wait does not work in ForEach

      const file: string = filesList[index];
      const gitFileInfos = new GitFileInfos();
      if (typeof args !== 'undefined' && typeof args.branch !== 'undefined') {
        gitFileInfos.fileBranch = render(args.branch, ruleResult);
      } else {
        // Default
        if (typeof (ruleResult as any).data.branch !== 'undefined') {
          gitFileInfos.fileBranch = (ruleResult as any).data.branch;
        } else {
          gitFileInfos.fileBranch = 'master';
        }
      }
      gitFileInfos.commitMessage = render(args.message, ruleResult);
      gitFileInfos.filePath = render(file, ruleResult);

      if (gitApiInfos.git === GitTypeEnum.Github) {
        await this.githubService.deleteFile(gitApiInfos, gitFileInfos);
      } else if (gitApiInfos.git === GitTypeEnum.Gitlab) {
        await this.gitlabService.deleteFile(gitApiInfos, gitFileInfos);
      }
    }
  }
}
