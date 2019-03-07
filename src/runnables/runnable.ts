import { Injectable, HttpService } from '@nestjs/common';
import { RunnableInterface } from './runnable.interface';
import { LoggerRunnable } from './logger.runnable';
import { Rule } from '../rules/rule.class';
import { WebhookRunnable } from './webhook.runnable';
import { RuleResult } from '../rules/ruleResult';
import { CommentIssueRunnable } from './commentIssue.runnable';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { CommentPullRequestRunnable } from './commentPullRequest.runnable';
import { SendEmailRunnable } from './sendEmail.runnable';
import { CreatePullRequestRunnable } from './createPullRequest.runnable';
import { Group } from '../rules/group.class';

export enum CallbackType {
  Success = 'Success',
  Error = 'Error',
}

@Injectable()
export class RunnableService {
  constructor(
    private readonly httpService: HttpService,
    private readonly githubService: GithubService,
    private readonly gitlabService: GitlabService,
  ) {}

  getRunnable(name: string): RunnableInterface {
    let runnable: RunnableInterface;
    switch (name) {
      case 'LoggerRunnable':
        runnable = new LoggerRunnable();
        break;
      case 'WebhookRunnable':
        runnable = new WebhookRunnable(this.httpService);
        break;
      case 'CommentIssueRunnable':
        runnable = new CommentIssueRunnable(
          this.githubService,
          this.gitlabService,
        );
        break;
      case 'CommentPullRequestRunnable':
        runnable = new CommentPullRequestRunnable(
          this.githubService,
          this.gitlabService,
        );
        break;
      case 'CreatePullRequestRunnable':
        runnable = new CreatePullRequestRunnable(
          this.githubService,
          this.gitlabService,
        );
        break;
      case 'SendEmailRunnable':
        runnable = new SendEmailRunnable();
        break;
    }
    return runnable;
  }

  executeRunnableFunctions(
    ruleResult: RuleResult,
    ruleOrGroup: Rule | Group,
  ): boolean {
    let runnable: RunnableInterface;
    if (ruleResult.validated) {
      ruleOrGroup.onSuccess.forEach(success => {
        runnable = this.getRunnable(success.callback);
        runnable.run(CallbackType.Success, ruleResult, success.args);
      });
      return true;
    } else {
      ruleOrGroup.onError.forEach(error => {
        runnable = this.getRunnable(error.callback);
        runnable.run(CallbackType.Error, ruleResult, error.args);
      });
      return false;
    }
  }
}
