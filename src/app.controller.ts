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
    let whichGit: GitTypeEnum = GitTypeEnum.Undefined;
    let gitService: GitServiceInterface;

    if (request.headers['x-gitlab-event'] !== undefined) {
      whichGit = GitTypeEnum.Gitlab;
      gitService = this.gitlabService;
    } else if (request.headers['x-github-event'] !== undefined) {
      whichGit = GitTypeEnum.Github;
      gitService = this.githubService;
    }

    if (whichGit === GitTypeEnum.Undefined) {
      return 'error';
    }

    // tslint:disable-next-line:no-string-literal
    const commitMessage = webhookDto.commits[0].message;
    // tslint:disable-next-line:no-string-literal
    const commitSha = webhookDto.commits[0].id;

    const commitRegExp = RegExp(/(feat|fix|docs)\(?[a-z]*\)?:\s.*/);

    const commitStatus = commitRegExp.test(commitMessage)
      ? CommitStatusEnum.Success
      : CommitStatusEnum.Failure;

    const commitStatusInfos = new CommitStatusInfos();
    commitStatusInfos.commitStatus = commitStatus;
    commitStatusInfos.commitSha = commitSha;
    commitStatusInfos.descriptionMessage = 'my message';

    if (isGitlabPushEvent(webhookDto)) {
      commitStatusInfos.projectId = webhookDto.project_id.toString();
    } else if (isGithubPushEvent(webhookDto)) {
      commitStatusInfos.repositoryFullName = webhookDto.repository.full_name;
    }
    gitService.updateCommitStatus(commitStatusInfos);

    return 'ok';
  }
}
