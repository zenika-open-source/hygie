import { Get, Controller, Body, Post, HttpService, Req } from '@nestjs/common';
import { AppService } from './app.service';
import {
  GitTypeEnum,
  CommitStatusEnum,
  isGitlabPushEvent,
  isGithubPushEvent,
} from './webhook/utils.enum';
import { GithubService } from './github/github.service';
import { GitlabService } from './gitlab/gitlab.service';
import { GitServiceInterface } from './interfaces/git.service.interface';
import { CommitStatusInfos } from './webhook/commitStatusInfos';
import { GithubPushEvent } from './github/githubPushEvent';
import { GitlabPushEvent } from './gitlab/gitlabPushEvent';
import { Webhook } from './webhook/webhook';

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
  processWebhook(
    @Req() request,
    @Body() webhookDto: GithubPushEvent | GitlabPushEvent,
  ): string {
    const webhook: Webhook = new Webhook(
      this.gitlabService,
      this.githubService,
    );

    // this webhook object now contains all data we need
    webhook.gitToWebhook(webhookDto);

    // 1st rule
    const commitMessage = webhook.commits[0].message;
    const commitRegExp = RegExp(/(feat|fix|docs)\(?[a-z]*\)?:\s.*/);
    const commitStatus = commitRegExp.test(commitMessage)
      ? CommitStatusEnum.Success
      : CommitStatusEnum.Failure;

    webhook.gitService.updateCommitStatus(
      webhook.gitCommitStatusInfos(commitStatus),
    );

    return 'ok';
  }
}
