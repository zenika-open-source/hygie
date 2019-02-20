import { RunnableInterface } from './runnable.interface';
import { logger } from '../logger/logger.service';
import { RuleResult } from '../rules/ruleResult';
import { render } from 'mustache';
import { GitApiInfos } from '../git/gitApiInfos';
import { GitIssueInfos } from '../git/gitIssueInfos';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { GitTypeEnum } from '../webhook/utils.enum';
import { Injectable } from '@nestjs/common';

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
    switch (data.git) {
      case GitTypeEnum.Github:
        this.githubService.addIssueComment(data.gitApiInfos, gitIssueInfos);
        break;
      case GitTypeEnum.Gitlab:
        this.gitlabService.addIssueComment(data.gitApiInfos, gitIssueInfos);
        break;
    }
  }
}
