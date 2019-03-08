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
import { UpdateCommitStatusRunnable } from './updateCommitStatus.runnable';

export enum CallbackType {
  Success = 'Success',
  Error = 'Error',
  Both = 'Both',
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
      case 'UpdateCommitStatusRunnable':
        runnable = new UpdateCommitStatusRunnable(
          this.githubService,
          this.gitlabService,
        );
        break;
    }
    return runnable;
  }

  executeRunnableFunctions(
    ruleResult: RuleResult,
    ruleOrGroup: Rule | Group,
  ): boolean {
    let runnable: RunnableInterface;

    if (typeof ruleOrGroup.onBoth !== 'undefined') {
      ruleOrGroup.onBoth.forEach(both => {
        runnable = this.getRunnable(both.callback);
        runnable.run(CallbackType.Both, ruleResult, both.args);
      });
    }

    if (ruleResult.validated && typeof ruleOrGroup.onSuccess !== 'undefined') {
      ruleOrGroup.onSuccess.forEach(success => {
        runnable = this.getRunnable(success.callback);
        runnable.run(CallbackType.Success, ruleResult, success.args);
      });
      return true;
    } else if (
      !ruleResult.validated &&
      typeof ruleOrGroup.onError !== 'undefined'
    ) {
      ruleOrGroup.onError.forEach(error => {
        runnable = this.getRunnable(error.callback);
        runnable.run(CallbackType.Error, ruleResult, error.args);
      });
      return false;
    }

    return false;
  }
}
