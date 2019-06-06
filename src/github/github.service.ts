import { Injectable, HttpService } from '@nestjs/common';
import { GitServiceInterface } from '../git/git.service.interface';
import {
  GitTypeEnum,
  convertCommitStatus,
  convertIssueState,
  convertIssuePRSearchState,
} from '../webhook/utils.enum';
import { GitCommitStatusInfos } from '../git/gitCommitStatusInfos';
import { GitApiInfos } from '../git/gitApiInfos';
import {
  GitIssueInfos,
  GitIssuePRSearch,
  IssueSearchResult,
} from '../git/gitIssueInfos';
import {
  GitCommentPRInfos,
  GitPRInfos,
  GitMergePRInfos,
  PRMethodsEnum,
  PRSearchResult,
} from '../git/gitPRInfos';
import { logger } from '../logger/logger.service';
import { PreconditionException } from '../exceptions/precondition.exception';
import { GitFileInfos } from '../git/gitFileInfos';
import { Utils } from '../utils/utils';
import { DataAccessService } from '../data_access/dataAccess.service';
import { GitEnv } from '../git/gitEnv.interface';
import { GitRelease } from '../git/gitRelease';
import { GitCommit } from '../git/gitCommit';
import { GitRef } from '../git/gitRef';
import { GitTag } from '../git/gitTag';
import { GitBranchCommit } from '../git/gitBranchSha';

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

  async setEnvironmentVariables(
    dataAccessService: DataAccessService,
    filePath: string,
  ): Promise<void> {
    const gitEnv: GitEnv = await Utils.getGitEnv(
      dataAccessService,
      'remote-envs/' + filePath + '/config.env',
    )
      .then(res => res)
      .catch(e => {
        throw new PreconditionException();
      });

    this.setToken(gitEnv.gitToken);
    this.setUrlApi(gitEnv.gitApi);
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
      context: process.env.APPLICATION_NAME,
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
    gitCreatePRInfos: GitPRInfos,
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
    const dataGitHub: any = {};

    if (typeof gitIssueInfos.state !== 'undefined') {
      dataGitHub.state = convertIssueState(
        GitTypeEnum.Github,
        gitIssueInfos.state,
      );
    }
    if (typeof gitIssueInfos.labels !== 'undefined') {
      dataGitHub.labels = gitIssueInfos.labels;
    }

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

  createIssue(gitApiInfos: GitApiInfos, gitIssueInfos: GitIssueInfos): void {
    const dataGitHub: any = {};

    if (typeof gitIssueInfos.title !== 'undefined') {
      dataGitHub.title = gitIssueInfos.title;
    } else {
      // Title is required
      return;
    }
    if (typeof gitIssueInfos.labels !== 'undefined') {
      dataGitHub.labels = gitIssueInfos.labels;
    }
    if (typeof gitIssueInfos.assignees !== 'undefined') {
      dataGitHub.assignees = gitIssueInfos.assignees;
    }
    if (typeof gitIssueInfos.description !== 'undefined') {
      dataGitHub.body = gitIssueInfos.description;
    }

    this.httpService
      .post(
        `${this.urlApi}/repos/${gitApiInfos.repositoryFullName}/issues`,
        dataGitHub,
        this.configGitHub,
      )
      .subscribe(null, err => logger.error(err));
  }

  deleteFile(
    gitApiInfos: GitApiInfos,
    gitFileInfos: GitFileInfos,
  ): Promise<void> {
    const localConfig: any = JSON.parse(JSON.stringify(this.configGitHub));

    return new Promise((resolve, reject) => {
      // First of all, get file blob sha
      this.httpService
        .get(
          `${this.urlApi}/repos/${gitApiInfos.repositoryFullName}/contents/${
            gitFileInfos.filePath
          }`,
          this.configGitHub,
        )
        .subscribe(
          response => {
            localConfig.params = {
              sha: response.data.sha,
              message: gitFileInfos.commitMessage,
              branch: gitFileInfos.fileBranch,
            };

            this.httpService
              .delete(
                `${this.urlApi}/repos/${
                  gitApiInfos.repositoryFullName
                }/contents/${gitFileInfos.filePath}`,
                localConfig,
              )
              .subscribe(
                response2 => resolve(),
                err2 => {
                  logger.error(err2);
                  reject(err2);
                },
              );
          },
          err => {
            logger.error(err);
            reject(err);
          },
        );
    });
  }

  mergePullRequest(
    gitApiInfos: GitApiInfos,
    gitMergePRInfos: GitMergePRInfos,
  ): void {
    const dataGitHub: any = {};

    if (gitMergePRInfos.commitTitle !== undefined) {
      dataGitHub.commit_title = gitMergePRInfos.commitTitle;
    }
    if (gitMergePRInfos.commitMessage !== undefined) {
      dataGitHub.commit_message = gitMergePRInfos.commitMessage;
    }
    if (gitMergePRInfos.sha !== undefined) {
      dataGitHub.sha = gitMergePRInfos.sha;
    }
    dataGitHub.merge_method =
      gitMergePRInfos.method !== undefined
        ? gitMergePRInfos.method.toLowerCase()
        : PRMethodsEnum.Merge.toLocaleLowerCase();

    this.httpService
      .put(
        `${this.urlApi}/repos/${gitApiInfos.repositoryFullName}/pulls/${
          gitMergePRInfos.number
        }/merge`,
        dataGitHub,
        this.configGitHub,
      )
      .subscribe(null, err => logger.error(err));
  }

  updatePullRequest(gitApiInfos: GitApiInfos, gitPRInfos: GitPRInfos): void {
    const dataGitHub: any = {};

    if (typeof gitPRInfos.state !== 'undefined') {
      dataGitHub.state = convertIssueState(
        GitTypeEnum.Github,
        gitPRInfos.state,
      );
    }
    if (typeof gitPRInfos.title !== 'undefined') {
      dataGitHub.title = gitPRInfos.title;
    }
    if (typeof gitPRInfos.target !== 'undefined') {
      dataGitHub.base = gitPRInfos.target;
    }
    if (typeof gitPRInfos.description !== 'undefined') {
      dataGitHub.body = gitPRInfos.description;
    }

    this.httpService
      .patch(
        `${this.urlApi}/repos/${gitApiInfos.repositoryFullName}/pulls/${
          gitPRInfos.number
        }`,
        dataGitHub,
        this.configGitHub,
      )
      .subscribe(null, err => logger.error(err));
  }

  createWebhook(gitApiInfos: GitApiInfos, webhookURL: string): void {
    this.httpService
      .post(
        `${this.urlApi}/repos/${gitApiInfos.repositoryFullName}/hooks`,
        {
          name: 'web',
          active: true,
          events: ['*'],
          config: {
            url: `${webhookURL}`,
            content_type: 'json',
          },
        },
        this.configGitHub,
      )
      .subscribe(null, err => logger.error(err));
  }

  async getIssues(
    gitApiInfos: GitApiInfos,
    gitIssueSearch: GitIssuePRSearch,
  ): Promise<IssueSearchResult[]> {
    const customGithubConfig = JSON.parse(JSON.stringify(this.configGitHub));
    customGithubConfig.params = {};
    if (typeof gitIssueSearch.sort !== 'undefined') {
      customGithubConfig.params.direction = gitIssueSearch.sort.toLowerCase();
    }
    if (typeof gitIssueSearch.state !== 'undefined') {
      customGithubConfig.params.state = convertIssuePRSearchState(
        GitTypeEnum.Github,
        gitIssueSearch.state,
      );
    }

    return await this.httpService
      .get(
        `${this.urlApi}/repos/${gitApiInfos.repositoryFullName}/issues`,
        customGithubConfig,
      )
      .toPromise()
      .then(res => {
        return res.data.map(d => {
          if (typeof d.pull_request === 'undefined') {
            // Pull Requests are considered as Issues
            const issueSearchResult = new IssueSearchResult();
            issueSearchResult.updatedAt = d.updated_at;
            issueSearchResult.number = d.number;
            return issueSearchResult;
          }
        });
      })
      .catch(err => logger.error(err));
  }

  async getPullRequests(
    gitApiInfos: GitApiInfos,
    gitIssueSearch: GitIssuePRSearch,
  ): Promise<PRSearchResult[]> {
    const customGithubConfig = JSON.parse(JSON.stringify(this.configGitHub));
    customGithubConfig.params = {};
    if (typeof gitIssueSearch.sort !== 'undefined') {
      customGithubConfig.params.direction = gitIssueSearch.sort.toLowerCase();
    }
    if (typeof gitIssueSearch.state !== 'undefined') {
      customGithubConfig.params.state = convertIssuePRSearchState(
        GitTypeEnum.Github,
        gitIssueSearch.state,
      );
    }

    return await this.httpService
      .get(
        `${this.urlApi}/repos/${gitApiInfos.repositoryFullName}/pulls`,
        customGithubConfig,
      )
      .toPromise()
      .then(res => {
        return res.data.map(d => {
          const prSearchResult = new PRSearchResult();
          prSearchResult.updatedAt = d.updated_at;
          prSearchResult.number = d.number;
          return prSearchResult;
        });
      })
      .catch(err => logger.error(err));
  }

  createRelease(gitApiInfos: GitApiInfos, gitRelease: GitRelease): void {
    const dataGithub: any = {};
    dataGithub.tag_name = gitRelease.tag;
    if (typeof gitRelease.ref !== 'undefined') {
      dataGithub.target_commitish = gitRelease.ref;
    }
    if (typeof gitRelease.name !== 'undefined') {
      dataGithub.name = gitRelease.name;
    }
    if (typeof gitRelease.description !== 'undefined') {
      dataGithub.body = gitRelease.description;
    }
    this.httpService
      .post(
        `${this.urlApi}/repos/${gitApiInfos.repositoryFullName}/releases`,
        dataGithub,
        this.configGitHub,
      )
      .subscribe(null, err => logger.error(err));
  }

  async getTree(
    gitApiInfos: GitApiInfos,
    directoryPath: string,
    branch: string = 'master',
  ): Promise<string> {
    const { base, name } = Utils.splitDirectoryPath(directoryPath);
    const customGithubConfig = JSON.parse(JSON.stringify(this.configGitHub));
    customGithubConfig.params = {
      ref: branch,
    };
    return await this.httpService
      .get(
        `${this.urlApi}/repos/${
          gitApiInfos.repositoryFullName
        }/contents/${base}`,
        customGithubConfig,
      )
      .toPromise()
      .then(response => {
        return response.data.find(e => e.name === name).sha;
      })
      .catch(err => logger.error(err, { location: 'getTree' }));
  }

  async getLastCommit(
    gitApiInfos: GitApiInfos,
    branch: string = 'master',
  ): Promise<string> {
    return this.httpService
      .get(
        `${this.urlApi}/repos/${
          gitApiInfos.repositoryFullName
        }/git/refs/heads/${branch}`,
        this.configGitHub,
      )
      .toPromise()
      .then(response => response.data.object.sha)
      .catch(err => logger.error(err, { location: 'updateRef' }));
  }

  async createCommit(
    gitApiInfos: GitApiInfos,
    gitCommit: GitCommit,
  ): Promise<string> {
    return await this.httpService
      .post(
        `${this.urlApi}/repos/${gitApiInfos.repositoryFullName}/git/commits`,
        gitCommit,
        this.configGitHub,
      )
      .toPromise()
      .then(response => {
        return response.data.sha;
      })
      .catch(err => logger.error(err, { location: 'createCommit' }));
  }

  updateRef(gitApiInfos: GitApiInfos, gitRef: GitRef): void {
    this.httpService
      .patch(
        `${this.urlApi}/repos/${gitApiInfos.repositoryFullName}/git/${
          gitRef.refName
        }`,
        {
          sha: gitRef.sha,
          force: gitRef.force,
        },
        this.configGitHub,
      )
      .subscribe(null, err => logger.error(err, { location: 'updateRef' }));
  }

  createRef(gitApiInfos: GitApiInfos, gitRef: GitRef): void {
    this.httpService
      .post(
        `${this.urlApi}/repos/${gitApiInfos.repositoryFullName}/git/refs`,
        {
          sha: gitRef.sha,
          ref: gitRef.refName,
        },
        this.configGitHub,
      )
      .subscribe(null, err => logger.error(err, { location: 'createRef' }));
  }

  async createTag(gitApiInfos: GitApiInfos, gitTag: GitTag): Promise<string> {
    return await this.httpService
      .post(
        `${this.urlApi}/repos/${gitApiInfos.repositoryFullName}/git/tags`,
        {
          tag: gitTag.tag,
          message: gitTag.message,
          object: gitTag.sha,
          type: gitTag.type,
        },
        this.configGitHub,
      )
      .toPromise()
      .then(response => response.data.sha)
      .catch(err => logger.error(err, { location: 'createTag' }));
  }

  async getLastBranchesCommitSha(
    gitApiInfos: GitApiInfos,
  ): Promise<GitBranchCommit[]> {
    return await this.httpService
      .get(
        `${this.urlApi}/repos/${gitApiInfos.repositoryFullName}/branches`,
        this.configGitHub,
      )
      .toPromise()
      .then(response =>
        response.data.map(b => {
          return { commitSha: b.commit.sha, branch: b.name };
        }),
      )
      .catch(err => {
        logger.error(err, { location: 'getLastBranchesCommitSha' });
        return [];
      });
  }
}
