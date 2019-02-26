import { Injectable, HttpService } from '@nestjs/common';
import { GitServiceInterface } from '../git/git.service.interface';
import { convertCommitStatus, GitTypeEnum } from '../webhook/utils.enum';
import { GitCommitStatusInfos } from '../git/gitCommitStatusInfos';
import { GitApiInfos } from '../git/gitApiInfos';
import { GitIssueInfos } from '../git/gitIssueInfos';
import { GitCommentPRInfos, GitCreatePRInfos } from '../git/gitPRInfos';

@Injectable()
export class GitlabService implements GitServiceInterface {
  token: string;
  urlApi: string;

  constructor(private readonly httpService: HttpService) {
    require('dotenv').config({ path: 'config.env' });
    this.token = process.env.GITLAB_TOKEN;
    this.urlApi = process.env.GITLAB_API;
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
      .subscribe();
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
      .subscribe();
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
      .subscribe();
  }

  createPullRequest(
    gitApiInfos: GitApiInfos,
    gitCreatePRInfos: GitCreatePRInfos,
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
      .subscribe();
  }
}
