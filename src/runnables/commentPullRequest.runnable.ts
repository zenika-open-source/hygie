import { RunnableInterface } from './runnable.interface';
import { RuleResult } from '../rules/ruleResult';
import { GitIssueInfos } from '../git/gitIssueInfos';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { GitTypeEnum } from '../webhook/utils.enum';
import { Injectable } from '@nestjs/common';
import { GitCommentPRInfos } from '../git/gitPRInfos';
import { CallbackType } from './runnable';
import { GitApiInfos } from '../git/gitApiInfos';

interface CommentPRArgs {
  comment: string;
}

@Injectable()
export class CommentPullRequestRunnable implements RunnableInterface {
  name: string = 'CommentPullRequestRunnable';
  constructor(
    private readonly githubService: GithubService,
    private readonly gitlabService: GitlabService,
  ) {}
  run(
    callbackType: CallbackType,
    ruleResult: RuleResult,
    args: CommentPRArgs,
  ): void {
    const data = ruleResult.data as any;
    const gitPRInfos: GitCommentPRInfos = new GitCommentPRInfos();
    gitPRInfos.number = data.pullRequestNumber;
    gitPRInfos.comment = args.comment;
    const gitApiInfos: GitApiInfos = ruleResult.gitApiInfos;

    if (gitApiInfos.git === GitTypeEnum.Github) {
      this.githubService.addPRComment(gitApiInfos, gitPRInfos);
    } else if (gitApiInfos.git === GitTypeEnum.Gitlab) {
      this.gitlabService.addPRComment(gitApiInfos, gitPRInfos);
    }
  }
}
