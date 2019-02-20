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
  urlApi: string;

  configGitHub: object;

  constructor(private readonly httpService: HttpService) {
    require('dotenv').config({ path: 'config.env' });
    this.token = process.env.GITHUB_TOKEN;
    this.configGitHub = {
      headers: {
        Authorization: 'token ' + this.token,
      },
    };
    this.urlApi = process.env.GITHUB_API;
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
        `${this.urlApi}/repos/${gitApiInfos.repositoryFullName}/statuses/${
          gitCommitStatusInfos.commitSha
        }`,
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

    logger.info(
      `${this.urlApi}/repos/${gitApiInfos.repositoryFullName}/issues/${
        gitIssueInfos.number
      }/comments`,
    );

    this.httpService
      .post(
        `${this.urlApi}/repos/${gitApiInfos.repositoryFullName}/issues/${
          gitIssueInfos.number
        }/comments`,
        dataGitHub,
        this.configGitHub,
      )
      .toPromise()
      // tslint:disable-next-line:no-console
      .then(response => console.log(response));
  }
}
