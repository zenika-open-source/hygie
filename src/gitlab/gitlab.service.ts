import { Injectable, HttpService } from '@nestjs/common';
import { GitServiceInterface } from '../git/git.service.interface';
import {
  convertCommitStatus,
  GitTypeEnum,
  convertIssueState,
  convertIssuePRSearchState,
} from '../webhook/utils.enum';
import { GitCommitStatusInfos } from '../git/gitCommitStatusInfos';
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
import { GitFileInfos } from '../git/gitFileInfos';
import { Utils } from '../utils/utils';
import { DataAccessService } from '../data_access/dataAccess.service';
import { GitEnv } from '../git/gitEnv.interface';
import { PreconditionException } from '../exceptions/precondition.exception';
import { GitRelease } from '../git/gitRelease';
import { GitTag } from '../git/gitTag';
import { GitBranchCommit } from '../git/gitBranchSha';
import { GitFileData } from '../git/gitFileData';
import { LoggerService } from '~common/providers/logger/logger.service';

/**
 * Implement `GitServiceInterface` to interact this a Gitlab repository
 */
@Injectable()
export class GitlabService implements GitServiceInterface {
  token: string;
  urlApi: string;
  projectId: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly loggerService: LoggerService,
  ) {}

  setToken(token: string) {
    this.token = token;
  }

  setUrlApi(urlApi: string) {
    this.urlApi = urlApi;
  }

  setProjectId(projectId: string) {
    this.projectId = projectId;
  }

  async setEnvironmentVariables(
    dataAccessService: DataAccessService,
    repositoryFullName: string,
  ): Promise<void> {
    const gitEnv: GitEnv = await Utils.getGitEnv(
      dataAccessService,
      'remote-envs/' + repositoryFullName + '/config.env',
    )
      .then(res => res)
      .catch(e => {
        throw new PreconditionException();
      });

    this.setToken(Utils.decryptValue(gitEnv.gitToken));
    this.setUrlApi(gitEnv.gitApi);
    this.setProjectId(gitEnv.gitlabId);
  }

  updateCommitStatus(gitCommitStatusInfos: GitCommitStatusInfos): void {
    // Config URL for GitLab
    const configGitLab = {
      headers: {
        'PRIVATE-TOKEN': this.token,
      },
      params: {
        state: convertCommitStatus(
          GitTypeEnum.Gitlab,
          gitCommitStatusInfos.commitStatus,
        ),
        target_url: gitCommitStatusInfos.targetUrl,
        description: gitCommitStatusInfos.descriptionMessage,
        context: process.env.APPLICATION_NAME + '/commit',
      },
    };

    // Data for GitLab
    const dataGitLab = {};

    this.httpService
      .post(
        `${this.urlApi}/projects/${this.projectId}/statuses/${
          gitCommitStatusInfos.commitSha
        }`,
        dataGitLab,
        configGitLab,
      )
      .subscribe(null, err =>
        this.loggerService.error(err, { location: 'updateCommitStatus' }),
      );
  }

  addIssueComment(gitIssueInfos: GitIssueInfos): void {
    // Config URL for GitLab
    const configGitLab = {
      headers: {
        'PRIVATE-TOKEN': this.token,
      },
      params: {
        body: gitIssueInfos.comment,
      },
    };

    // Data for GitLab
    const dataGitLab = {};

    this.httpService
      .post(
        `${this.urlApi}/projects/${this.projectId}/issues/${
          gitIssueInfos.number
        }/notes`,
        dataGitLab,
        configGitLab,
      )
      .subscribe(null, err =>
        this.loggerService.error(err, { location: 'addIssueComment' }),
      );
  }

  addPRComment(gitCommentPRInfos: GitCommentPRInfos): void {
    // Config URL for GitLab
    const configGitLab = {
      headers: {
        'PRIVATE-TOKEN': this.token,
      },
      params: {
        body: gitCommentPRInfos.comment,
      },
    };

    // Data for GitLab
    const dataGitLab = {};

    this.httpService
      .post(
        `${this.urlApi}/projects/${this.projectId}/merge_requests/${
          gitCommentPRInfos.number
        }/notes`,
        dataGitLab,
        configGitLab,
      )
      .subscribe(null, err =>
        this.loggerService.error(err, { location: 'addPRComment' }),
      );
  }

  createPullRequest(gitCreatePRInfos: GitPRInfos): void {
    // Config URL for GitLab
    const configGitLab = {
      headers: {
        'PRIVATE-TOKEN': this.token,
      },
      params: {
        title: gitCreatePRInfos.title,
        source_branch: gitCreatePRInfos.source,
        target_branch: gitCreatePRInfos.target,
        description: gitCreatePRInfos.description,
      },
    };

    // Data for GitLab
    const dataGitLab = {};

    this.httpService
      .post(
        `${this.urlApi}/projects/${this.projectId}/merge_requests`,
        dataGitLab,
        configGitLab,
      )
      .subscribe(null, err =>
        this.loggerService.error(err, { location: 'createPullRequest' }),
      );
  }

  deleteBranch(branchName: string) {
    // Config URL for GitLab
    const configGitLab = {
      headers: {
        'PRIVATE-TOKEN': this.token,
      },
    };
    this.httpService
      .delete(
        `${this.urlApi}/projects/${
          this.projectId
        }/repository/branches/${encodeURIComponent(branchName)}`,
        configGitLab,
      )
      .subscribe(null, err =>
        this.loggerService.error(err, { location: 'deleteBranch' }),
      );
  }

  updateIssue(gitIssueInfos: GitIssueInfos): void {
    // Config URL for GitLab
    const configGitLab = {
      headers: {
        'PRIVATE-TOKEN': this.token,
      },
      params: {},
    };

    if (typeof gitIssueInfos.state !== 'undefined') {
      (configGitLab.params as any).state_event = convertIssueState(
        GitTypeEnum.Gitlab,
        gitIssueInfos.state,
      );
    }
    if (typeof gitIssueInfos.labels !== 'undefined') {
      (configGitLab.params as any).labels = gitIssueInfos.labels.join(',');
    }

    // Data for GitLab
    const dataGitLab = {};
    this.httpService
      .put(
        `${this.urlApi}/projects/${this.projectId}/issues/${
          gitIssueInfos.number
        }`,
        dataGitLab,
        configGitLab,
      )
      .subscribe(null, err =>
        this.loggerService.error(err, { location: 'updateIssue' }),
      );
  }

  async createIssue(gitIssueInfos: GitIssueInfos): Promise<number> {
    // Config URL for GitLab
    const configGitLab = {
      headers: {
        'PRIVATE-TOKEN': this.token,
      },
      params: {},
    };

    // Data for GitLab
    const dataGitLab = {};

    if (typeof gitIssueInfos.title !== 'undefined') {
      (configGitLab.params as any).title = gitIssueInfos.title;
    } else {
      // Title is required
      return;
    }
    if (typeof gitIssueInfos.labels !== 'undefined') {
      (configGitLab.params as any).labels = gitIssueInfos.labels.join(',');
    }
    if (typeof gitIssueInfos.description !== 'undefined') {
      (configGitLab.params as any).description = gitIssueInfos.description;
    }

    return await this.httpService
      .post(
        `${this.urlApi}/projects/${this.projectId}/issues`,
        dataGitLab,
        configGitLab,
      )
      .toPromise()
      .then(response => response.data.iid)
      .catch(err => this.loggerService.error(err, { location: 'createIssue' }));
  }

  async deleteFile(gitFileInfos: GitFileInfos): Promise<void> {
    // Config URL for GitLab
    const configGitLab = {
      headers: {
        'PRIVATE-TOKEN': this.token,
      },
      params: {
        commit_message: gitFileInfos.commitMessage,
        branch: gitFileInfos.fileBranch,
      },
    };
    this.httpService
      .delete(
        `${this.urlApi}/projects/${
          this.projectId
        }/repository/files/${encodeURIComponent(gitFileInfos.filePath)}`,
        configGitLab,
      )
      .subscribe(
        response => {
          return;
        },
        err => {
          this.loggerService.error(err, { location: 'deleteFile' });
          throw err;
        },
      );
  }

  mergePullRequest(gitMergePRInfos: GitMergePRInfos): void {
    // Config URL for GitLab
    const configGitLab: any = {
      headers: {
        'PRIVATE-TOKEN': this.token,
      },
      params: {},
    };

    if (gitMergePRInfos.method === PRMethodsEnum.Squash) {
      configGitLab.params.squash = true;
    }

    if (gitMergePRInfos.commitMessage !== undefined) {
      configGitLab.params.squash_commit_message = gitMergePRInfos.commitMessage;
      configGitLab.params.merge_commit_message = gitMergePRInfos.commitMessage;
    }

    if (gitMergePRInfos.sha !== undefined) {
      configGitLab.params.sha = gitMergePRInfos.sha;
    }

    this.httpService
      .put(
        `${this.urlApi}/projects/${this.projectId}/merge_requests/${
          gitMergePRInfos.number
        }/merge`,
        {},
        configGitLab,
      )
      .subscribe(null, err =>
        this.loggerService.error(err, { location: 'mergePullRequest' }),
      );
  }

  updatePullRequest(gitPRInfos: GitPRInfos): void {
    // Config URL for GitLab
    const configGitLab: any = {
      headers: {
        'PRIVATE-TOKEN': this.token,
      },
      params: {},
    };

    if (typeof gitPRInfos.state !== 'undefined') {
      configGitLab.params.state_event = convertIssueState(
        GitTypeEnum.Gitlab,
        gitPRInfos.state,
      );
    }
    if (typeof gitPRInfos.title !== 'undefined') {
      configGitLab.params.title = gitPRInfos.title;
    }
    if (typeof gitPRInfos.target !== 'undefined') {
      configGitLab.params.target_branch = gitPRInfos.target;
    }
    if (typeof gitPRInfos.description !== 'undefined') {
      configGitLab.params.description = gitPRInfos.description;
    }

    // Data for GitLab
    const dataGitLab = {};
    this.httpService
      .put(
        `${this.urlApi}/projects/${this.projectId}/merge_requests/${
          gitPRInfos.number
        }`,
        dataGitLab,
        configGitLab,
      )
      .subscribe(null, err =>
        this.loggerService.error(err, { location: 'updatePullRequest' }),
      );
  }

  createWebhook(webhookURL: string): void {
    // Data for GitLab
    const dataGitLab = {};
    const configGitLab: any = {
      headers: {
        'PRIVATE-TOKEN': this.token,
      },
      params: {
        url: webhookURL,
        push_events: true,
        issues_events: true,
        confidential_issues_events: true,
        merge_requests_events: true,
        tag_push_events: true,
        note_events: true,
        job_events: true,
        pipeline_events: true,
        wiki_page_events: true,
        enable_ssl_verification: true,
        confidential_note_events: true,
      },
    };

    this.httpService
      .post(
        `${this.urlApi}/projects/${this.projectId}/hooks`,
        dataGitLab,
        configGitLab,
      )
      .subscribe(null, err =>
        this.loggerService.error(err, { location: 'createWebhook' }),
      );
  }

  async getIssues(
    gitIssueSearch: GitIssuePRSearch,
  ): Promise<IssueSearchResult[]> {
    const configGitLab: any = {
      headers: {
        'PRIVATE-TOKEN': this.token,
      },
      params: {},
    };
    if (typeof gitIssueSearch.sort !== 'undefined') {
      configGitLab.params.sort = gitIssueSearch.sort.toLowerCase();
    }
    if (typeof gitIssueSearch.state !== 'undefined') {
      configGitLab.params.state = convertIssuePRSearchState(
        GitTypeEnum.Gitlab,
        gitIssueSearch.state,
      );
    }

    return await this.httpService
      .get(`${this.urlApi}/projects/${this.projectId}/issues`, configGitLab)
      .toPromise()
      .then(res => {
        return res.data.map(d => {
          const issueSearchResult = new IssueSearchResult();
          issueSearchResult.updatedAt = d.updated_at;
          issueSearchResult.number = d.iid;
          return issueSearchResult;
        });
      })
      .catch(err => this.loggerService.error(err, { location: 'getIssues' }));
  }

  async getPullRequests(
    gitIssueSearch: GitIssuePRSearch,
  ): Promise<PRSearchResult[]> {
    const configGitLab: any = {
      headers: {
        'PRIVATE-TOKEN': this.token,
      },
      params: {},
    };
    if (typeof gitIssueSearch.sort !== 'undefined') {
      configGitLab.params.sort = gitIssueSearch.sort.toLowerCase();
    }
    if (typeof gitIssueSearch.state !== 'undefined') {
      configGitLab.params.state = convertIssuePRSearchState(
        GitTypeEnum.Gitlab,
        gitIssueSearch.state,
      );
    }

    return await this.httpService
      .get(
        `${this.urlApi}/projects/${this.projectId}/merge_requests`,
        configGitLab,
      )
      .toPromise()
      .then(res => {
        return res.data.map(d => {
          const prSearchResult = new PRSearchResult();
          prSearchResult.updatedAt = d.updated_at;
          prSearchResult.number = d.iid;
          return prSearchResult;
        });
      })
      .catch(err =>
        this.loggerService.error(err, { location: 'getPullRequests' }),
      );
  }

  createRelease(gitRelease: GitRelease): void {
    const configGitLab: any = {
      headers: {
        'PRIVATE-TOKEN': this.token,
      },
      params: {},
    };

    configGitLab.params.tag_name = gitRelease.tag;
    if (typeof gitRelease.ref !== 'undefined') {
      configGitLab.params.ref = gitRelease.ref;
    }
    if (typeof gitRelease.name !== 'undefined') {
      configGitLab.params.name = gitRelease.name;
    }
    if (typeof gitRelease.description !== 'undefined') {
      configGitLab.params.description = gitRelease.description;
    }

    this.httpService
      .post(
        `${this.urlApi}/projects/${this.projectId}/releases`,
        {},
        configGitLab,
      )
      .subscribe(null, err =>
        this.loggerService.error(err, { location: 'createRelease' }),
      );
  }

  createTag(gitTag: GitTag): void {
    const configGitLab: any = {
      headers: {
        'PRIVATE-TOKEN': this.token,
      },
      params: {
        tag_name: gitTag.tag,
        ref: gitTag.sha,
        message: gitTag.message,
      },
    };

    this.httpService
      .post(
        `${this.urlApi}/projects/${this.projectId}/repository/tags`,
        {},
        configGitLab,
      )
      .subscribe(null, err =>
        this.loggerService.error(err, { location: 'createTag' }),
      );
  }

  async getLastCommit(branch: string = 'master'): Promise<string> {
    const configGitLab: any = {
      headers: {
        'PRIVATE-TOKEN': this.token,
      },
      params: {},
    };
    return this.httpService
      .get(
        `${this.urlApi}/projects/${
          this.projectId
        }/repository/branches/${branch}`,
        configGitLab,
      )
      .toPromise()
      .then(response => response.data.commit.id)
      .catch(err =>
        this.loggerService.error(err, { location: 'getLastCommit' }),
      );
  }

  async getLastBranchesCommitSha(): Promise<GitBranchCommit[]> {
    const configGitLab: any = {
      headers: {
        'PRIVATE-TOKEN': this.token,
      },
      params: {},
    };
    return await this.httpService
      .get(
        `${this.urlApi}/projects/${this.projectId}/repository/branches`,
        configGitLab,
      )
      .toPromise()
      .then(response =>
        response.data.map(b => {
          return { commitSha: b.commit.id, branch: b.name };
        }),
      )
      .catch(err => {
        this.loggerService.error(err, { location: 'getLastBranchesCommitSha' });
        return [];
      });
  }

  async getFileContent(gitFileInfos: GitFileInfos): Promise<GitFileData> {
    const configGitLab: any = {
      headers: {
        'PRIVATE-TOKEN': this.token,
      },
      params: { ref: gitFileInfos.fileBranch },
    };

    return await this.httpService
      .get(
        `${this.urlApi}/projects/${this.projectId}/repository/files/${
          gitFileInfos.filePath
        }/raw`,
        configGitLab,
      )
      .toPromise()
      .then(response => response.data)
      .catch(err => {
        throw new Error(
          `${err}: ${gitFileInfos.filePath} do not exist on branch ${
            gitFileInfos.fileBranch
          }`,
        );
      });
  }
}
