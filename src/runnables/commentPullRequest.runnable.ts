import { RunnableInterface } from './runnable.interface';
import { RuleResult } from '../rules/ruleResult';
import { GitIssueInfos } from '../git/gitIssueInfos';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { GitTypeEnum } from '../webhook/utils.enum';
import { Injectable } from '@nestjs/common';
import { GitPRInfos } from '../git/gitPRInfos';

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
  run(ruleResult: RuleResult, args: CommentPRArgs): void {
    const data = ruleResult.data as any;
    const gitPRInfos: GitPRInfos = new GitPRInfos();
    gitPRInfos.number = data.pullRequestNumber;
    gitPRInfos.comment = args.comment;

    if (data.git === GitTypeEnum.Github) {
      this.githubService.addPRComment(data.gitApiInfos, gitPRInfos);
    } else if (data.git === GitTypeEnum.Gitlab) {
      this.gitlabService.addPRComment(data.gitApiInfos, gitPRInfos);
    }
  }
}
