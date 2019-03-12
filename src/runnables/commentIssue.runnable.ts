import { RunnableInterface } from './runnable.interface';
import { RuleResult } from '../rules/ruleResult';
import { GitIssueInfos } from '../git/gitIssueInfos';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { GitTypeEnum } from '../webhook/utils.enum';
import { Injectable } from '@nestjs/common';
import { CallbackType } from './runnable';
import { GitApiInfos } from '../git/gitApiInfos';

interface CommentIssueArgs {
  comment: string;
}

@Injectable()
export class CommentIssueRunnable implements RunnableInterface {
  name = 'CommentIssueRunnable';
  constructor(
    private readonly githubService: GithubService,
    private readonly gitlabService: GitlabService,
  ) {}
  run(
    callbackType: CallbackType,
    ruleResult: RuleResult,
    args: CommentIssueArgs,
  ): void {
    const data = ruleResult.data as any;
    const gitIssueInfos: GitIssueInfos = new GitIssueInfos();
    gitIssueInfos.number = data.issueNumber;
    gitIssueInfos.comment = args.comment;
    const gitApiInfos: GitApiInfos = ruleResult.gitApiInfos;

    if (gitApiInfos.git === GitTypeEnum.Github) {
      this.githubService.addIssueComment(gitApiInfos, gitIssueInfos);
    } else if (gitApiInfos.git === GitTypeEnum.Gitlab) {
      this.gitlabService.addIssueComment(gitApiInfos, gitIssueInfos);
    }
  }
}
