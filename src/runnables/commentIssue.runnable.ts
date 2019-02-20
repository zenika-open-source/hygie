import { RunnableInterface } from './runnable.interface';
import { RuleResult } from '../rules/ruleResult';
import { GitIssueInfos } from '../git/gitIssueInfos';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { GitTypeEnum } from '../webhook/utils.enum';
import { Injectable } from '@nestjs/common';
import { logger } from '../logger/logger.service';

interface CommentIssueArgs {
  comment: string;
}

@Injectable()
export class CommentIssueRunnable implements RunnableInterface {
  name: string = 'CommentIssueRunnable';
  constructor(
    private readonly githubService: GithubService,
    private readonly gitlabService: GitlabService,
  ) {}
  run(ruleResult: RuleResult, args: CommentIssueArgs): void {
    const data = ruleResult.data as any;
    const gitIssueInfos: GitIssueInfos = new GitIssueInfos();
    gitIssueInfos.number = data.issueNumber;
    gitIssueInfos.comment = args.comment;

    if (data.git === GitTypeEnum.Github) {
      this.githubService.addIssueComment(data.gitApiInfos, gitIssueInfos);
    } else if (data.git === GitTypeEnum.Gitlab) {
      this.gitlabService.addIssueComment(data.gitApiInfos, gitIssueInfos);
    }
  }
}
