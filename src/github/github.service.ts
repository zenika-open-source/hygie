import { Injectable, HttpService } from '@nestjs/common';
import { GitServiceInterface } from '../git/git.service.interface';
import {
  GitTypeEnum,
  convertCommitStatus,
  convertIssueState,
} from '../webhook/utils.enum';
import { GitCommitStatusInfos } from '../git/gitCommitStatusInfos';
import { GitApiInfos } from '../git/gitApiInfos';
import { GitIssueInfos } from '../git/gitIssueInfos';
import { GitCommentPRInfos, GitCreatePRInfos } from '../git/gitPRInfos';
import { logger } from '../logger/logger.service';
import { PreconditionException } from '../exceptions/precondition.exception';
import { loadEnv } from '../utils/dotenv.utils';

/**
 * Implement `GitServiceInterface` to interact this a Github repository
 */
@Injectable()
export class GithubService implements GitServiceInterface {
  token: string;
  urlApi: string;

  configGitHub: object;

  constructor(private readonly httpService: HttpService) {}

  setToken(token: string) {
    this.token = token;
  }

  setUrlApi(urlApi: string) {
    this.urlApi = urlApi;
  }

  setConfigGitHub(conf?: any) {
    this.configGitHub =
      typeof conf !== 'undefined'
        ? conf
        : {
            headers: {
              Authorization: 'token ' + this.token,
            },
          };
  }

  setEnvironmentVariables(filePath: string): void {
    loadEnv('remote-envs/' + filePath + '/config.env');

    if (
      process.env.gitToken === undefined ||
      process.env.gitToken === '' ||
      process.env.gitApi === undefined ||
      process.env.gitToken === ''
    ) {
      throw new PreconditionException();
    }
    this.setToken(process.env.gitToken);
    this.setUrlApi(process.env.gitApi);
    this.setConfigGitHub();
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
      .subscribe(null, err => logger.error(err));
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
        `${this.urlApi}/repos/${gitApiInfos.repositoryFullName}/issues/${
          gitIssueInfos.number
        }/comments`,
        dataGitHub,
        this.configGitHub,
      )
      .subscribe(null, err => logger.error(err));
  }

  // Github PR is based on Issue
  addPRComment(
    gitApiInfos: GitApiInfos,
    gitCommentPRInfos: GitCommentPRInfos,
  ): void {
    const gitIssueInfos: GitIssueInfos = new GitIssueInfos();
    gitIssueInfos.number = gitCommentPRInfos.number;
    gitIssueInfos.comment = gitCommentPRInfos.comment;
    this.addIssueComment(gitApiInfos, gitIssueInfos);
  }

  createPullRequest(
    gitApiInfos: GitApiInfos,
    gitCreatePRInfos: GitCreatePRInfos,
  ): void {
    const dataGitHub = {
      title: gitCreatePRInfos.title,
      body: gitCreatePRInfos.description,
      head: gitCreatePRInfos.source,
      base: gitCreatePRInfos.target,
    };

    this.httpService
      .post(
        `${this.urlApi}/repos/${gitApiInfos.repositoryFullName}/pulls`,
        dataGitHub,
        this.configGitHub,
      )
      .subscribe(null, err => logger.error(err));
  }

  deleteBranch(gitApiInfos: GitApiInfos, branchName: string): void {
    this.httpService
      .delete(
        `${this.urlApi}/repos/${
          gitApiInfos.repositoryFullName
        }/git/refs/heads/${encodeURIComponent(branchName)}`,
        this.configGitHub,
      )
      .subscribe(null, err => logger.error(err));
  }

  updateIssue(gitApiInfos: GitApiInfos, gitIssueInfos: GitIssueInfos): void {
    const dataGitHub = {
      state: convertIssueState(GitTypeEnum.Github, gitIssueInfos.state),
    };

    this.httpService
      .patch(
        `${this.urlApi}/repos/${gitApiInfos.repositoryFullName}/issues/${
          gitIssueInfos.number
        }`,
        dataGitHub,
        this.configGitHub,
      )
      .subscribe(null, err => logger.error(err));
  }
}
