import { Get, Controller, Body, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CommitStatusEnum, GitEventEnum } from './webhook/utils.enum';
import { GithubService } from './github/github.service';
import { GitlabService } from './gitlab/gitlab.service';
import { Webhook } from './webhook/webhook';
import { logger } from './logger/logger.service';
import { GithubEvent } from './github/githubEvent';
import { GitlabEvent } from './gitlab/gitlabEvent';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly gitlabService: GitlabService,
    private readonly githubService: GithubService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/webhook')
  processWebhook(@Body() webhookDto: GithubEvent | GitlabEvent): string {
    const webhook: Webhook = new Webhook(
      this.gitlabService,
      this.githubService,
    );

    // this webhook object now contains all data we need
    webhook.gitToWebhook(webhookDto);

    if (webhook.gitEvent === GitEventEnum.Push) {
      const commitMessage = webhook.commits[0].message;
      const commitRegExp = RegExp(/(feat|fix|docs)\(?[a-z]*\)?:\s.*/);
      const commitStatus = commitRegExp.test(commitMessage)
        ? CommitStatusEnum.Success
        : CommitStatusEnum.Failure;

      webhook.gitService.updateCommitStatus(
        webhook.gitCommitStatusInfos(commitStatus),
      );
    } else if (webhook.gitEvent === GitEventEnum.NewBranch) {
      const branchName = webhook.branchName;
      const branchRegExp = RegExp(/(features|fix)\/.*/);
      const branchNameAuthorized = branchRegExp.test(branchName) ? true : false;
      logger.info('branchNameAuthorized :' + branchNameAuthorized);
    }

    return 'ok';
  }
}
