import { Injectable, HttpService } from '@nestjs/common';
import { GitServiceInterface } from '../git/git.service.interface';
import {
  convertCommitStatus,
  GitTypeEnum,
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
import { GitFileInfos } from '../git/gitFileInfos';
import { Utils } from '../utils/utils';
import { DataAccessService } from '../data_access/dataAccess.service';
import { GitEnv } from '../git/gitEnv.interface';
import { PreconditionException } from '../exceptions/precondition.exception';

/**
 * Implement `GitServiceInterface` to interact this a Gitlab repository
 */
@Injectable()
export class GitlabService implements GitServiceInterface {
  token: string;
  urlApi: string;

  constructor(private readonly httpService: HttpService) {}

  setToken(token: string) {
    this.token = token;
  }

  setUrlApi(urlApi: string) {
    this.urlApi = urlApi;
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
  }

  updateCommitStatus(
    gitApiInfos: GitApiInfos,
    gitCommitStatusInfos: GitCommitStatusInfos,
  ): void {
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
      },
    };

    // Data for GitLab
    const dataGitLab = {};

    this.httpService
      .post(
        `${this.urlApi}/projects/${gitApiInfos.projectId}/statuses/${
          gitCommitStatusInfos.commitSha
        }`,
        dataGitLab,
        configGitLab,
      )
      .subscribe(null, err => logger.error(err));
  }

  addIssueComment(
    gitApiInfos: GitApiInfos,
    gitIssueInfos: GitIssueInfos,
  ): void {
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
        `${this.urlApi}/projects/${gitApiInfos.projectId}/issues/${
          gitIssueInfos.number
        }/notes`,
        dataGitLab,
        configGitLab,
      )
      .subscribe(null, err => logger.error(err));
  }

  addPRComment(
    gitApiInfos: GitApiInfos,
    gitCommentPRInfos: GitCommentPRInfos,
  ): void {
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
        `${this.urlApi}/projects/${gitApiInfos.projectId}/merge_requests/${
          gitCommentPRInfos.number
        }/notes`,
        dataGitLab,
        configGitLab,
      )
      .subscribe(null, err => logger.error(err));
  }

  createPullRequest(
    gitApiInfos: GitApiInfos,
    gitCreatePRInfos: GitPRInfos,
  ): void {
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
        `${this.urlApi}/projects/${gitApiInfos.projectId}/merge_requests`,
        dataGitLab,
        configGitLab,
      )
      .subscribe(null, err => logger.error(err));
  }

  deleteBranch(gitApiInfos: GitApiInfos, branchName: string) {
    // Config URL for GitLab
    const configGitLab = {
      headers: {
        'PRIVATE-TOKEN': this.token,
      },
    };
    this.httpService
      .delete(
        `${this.urlApi}/projects/${
          gitApiInfos.projectId
        }/repository/branches/${encodeURIComponent(branchName)}`,
        configGitLab,
      )
      .subscribe(null, err => logger.error(err));
  }

  updateIssue(gitApiInfos: GitApiInfos, gitIssueInfos: GitIssueInfos): void {
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
        `${this.urlApi}/projects/${gitApiInfos.projectId}/issues/${
          gitIssueInfos.number
        }`,
        dataGitLab,
        configGitLab,
      )
      .subscribe(null, err => logger.error(err));
  }

  createIssue(gitApiInfos: GitApiInfos, gitIssueInfos: GitIssueInfos): void {
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

    this.httpService
      .post(
        `${this.urlApi}/projects/${gitApiInfos.projectId}/issues`,
        dataGitLab,
        configGitLab,
      )
      .subscribe(null, err => logger.error(err));
  }

  deleteFile(
    gitApiInfos: GitApiInfos,
    gitFileInfos: GitFileInfos,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
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
            gitApiInfos.projectId
          }/repository/files/${encodeURIComponent(gitFileInfos.filePath)}`,
          configGitLab,
        )
        .subscribe(
          response => resolve(),
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
        `${this.urlApi}/projects/${gitApiInfos.projectId}/merge_requests/${
          gitMergePRInfos.number
        }/merge`,
        {},
        configGitLab,
      )
      .subscribe(null, err => logger.error(err));
  }

  updatePullRequest(gitApiInfos: GitApiInfos, gitPRInfos: GitPRInfos): void {
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
        `${this.urlApi}/projects/${gitApiInfos.projectId}/merge_requests/${
          gitPRInfos.number
        }`,
        dataGitLab,
        configGitLab,
      )
      .subscribe(null, err => logger.error(err));
  }

  createWebhook(gitApiInfos: GitApiInfos, webhookURL: string): void {
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
        `${this.urlApi}/projects/${gitApiInfos.projectId}/hooks`,
        dataGitLab,
        configGitLab,
      )
      .subscribe(null, err => logger.error(err));
  }

  async getIssues(
    gitApiInfos: GitApiInfos,
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
      .get(
        `${this.urlApi}/projects/${gitApiInfos.projectId}/issues`,
        configGitLab,
      )
      .toPromise()
      .then(res => {
        return res.data.map(d => {
          const issueSearchResult = new IssueSearchResult();
          issueSearchResult.updatedAt = d.updated_at;
          issueSearchResult.number = d.iid;
          return issueSearchResult;
        });
      })
      .catch(err => logger.error(err));
  }

  async getPullRequests(
    gitApiInfos: GitApiInfos,
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
        `${this.urlApi}/projects/${gitApiInfos.projectId}/merge_requests`,
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
      .catch(err => logger.error(err));
  }
}
