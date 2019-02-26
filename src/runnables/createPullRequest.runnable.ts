import { RunnableInterface } from './runnable.interface';
import { RuleResult } from '../rules/ruleResult';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { GitTypeEnum } from '../webhook/utils.enum';
import { Injectable } from '@nestjs/common';
import { GitCreatePRInfos } from '../git/gitPRInfos';
import { render } from 'mustache';

interface CreatePullRequestArgs {
  title: string;
  description: string;
  source: string;
  target: string;
}

@Injectable()
export class CreatePullRequestRunnable implements RunnableInterface {
  name: string = 'CreatePullRequestRunnable';
  constructor(
    private readonly githubService: GithubService,
    private readonly gitlabService: GitlabService,
  ) {}
  run(ruleResult: RuleResult, args: CreatePullRequestArgs): void {
    const data = ruleResult.data as any;

    const gitCreatePRInfos: GitCreatePRInfos = new GitCreatePRInfos();
    gitCreatePRInfos.description = render(args.description, ruleResult);
    gitCreatePRInfos.title = render(args.title, ruleResult);
    gitCreatePRInfos.source = render(args.source, ruleResult);
    gitCreatePRInfos.target = render(args.target, ruleResult);

    if (data.git === GitTypeEnum.Github) {
      this.githubService.createPullRequest(data.gitApiInfos, gitCreatePRInfos);
    } else if (data.git === GitTypeEnum.Gitlab) {
      this.gitlabService.createPullRequest(data.gitApiInfos, gitCreatePRInfos);
    }
  }
}
