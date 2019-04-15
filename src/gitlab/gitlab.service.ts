import { Injectable, HttpService } from '@nestjs/common';
import { GitServiceInterface } from '../git/git.service.interface';
import {
  convertCommitStatus,
  GitTypeEnum,
  convertIssueState,
} from '../webhook/utils.enum';
import { GitCommitStatusInfos } from '../git/gitCommitStatusInfos';
import { GitApiInfos } from '../git/gitApiInfos';
import { GitIssueInfos } from '../git/gitIssueInfos';
import {
  GitCommentPRInfos,
  GitPRInfos,
  GitMergePRInfos,
  PRMethodsEnum,
} from '../git/gitPRInfos';
import { logger } from '../logger/logger.service';
import { GitFileInfos } from '../git/gitFileInfos';
import { Utils } from '../utils/utils';

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

  setEnvironmentVariables(filePath: string): void {
    Utils.loadEnv('remote-envs/' + filePath + '/config.env');

    this.setToken(process.env.gitToken);
    this.setUrlApi(process.env.gitApi);
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
        .subscribe(null, err => logger.error(err));
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
}
