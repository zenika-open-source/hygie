import { Injectable, HttpService } from '@nestjs/common';
import { GitServiceInterface } from '../git/git.service.interface';
import { GitTypeEnum, convertCommitStatus } from '../webhook/utils.enum';
import { GitCommitStatusInfos } from '../git/gitCommitStatusInfos';
import { GitApiInfos } from '../git/gitApiInfos';
import { logger } from '../logger/logger.service';
import { GitIssueInfos } from '../git/gitIssueInfos';

@Injectable()
export class GithubService implements GitServiceInterface {
  token: string;

  configGitHub: object;

  constructor(private readonly httpService: HttpService) {
    require('dotenv').config({ path: 'config.env' });
    this.token = process.env.GITHUB_TOKEN;
    this.configGitHub = {
      headers: {
        Authorization: 'token ' + this.token,
      },
    };
  }

  updateCommitStatus(
    gitApiInfos: GitApiInfos,
    gitCommitStatusInfos: GitCommitStatusInfos,
  ): void {
    const dataGitHub = {
      state: convertCommitStatus(
        GitTypeEnum.Github,
        gitCommitStatusInfos.commitStatus,
      ),
      target_url: gitCommitStatusInfos.targetUrl,
      description: gitCommitStatusInfos.descriptionMessage,
    };

    this.httpService
      .post(
        `https://api.github.com/repos/${
          gitApiInfos.repositoryFullName
        }/statuses/${gitCommitStatusInfos.commitSha}`,
        dataGitHub,
        this.configGitHub,
      )
      .subscribe();
  }

  addIssueComment(
    gitApiInfos: GitApiInfos,
    gitIssueInfos: GitIssueInfos,
  ): void {
    const dataGitHub = {
      body: gitIssueInfos.comment,
    };

    this.httpService
      .post(
        `https://api.github.com/repos/${
          gitApiInfos.repositoryFullName
        }/issues/${gitIssueInfos.number}/comments`,
        dataGitHub,
        this.configGitHub,
      )
      .subscribe();
  }
}
