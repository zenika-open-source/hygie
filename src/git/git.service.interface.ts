import { GitCommitStatusInfos } from './gitCommitStatusInfos';
import {
  GitIssueInfos,
  GitIssuePRSearch,
  IssueSearchResult,
} from './gitIssueInfos';
import {
  GitCommentPRInfos,
  GitPRInfos,
  GitMergePRInfos,
  PRSearchResult,
} from './gitPRInfos';
import { GitFileInfos } from './gitFileInfos';
import { DataAccessService } from '../data_access/dataAccess.service';
import { GitRelease } from './gitRelease';
import { GitBranchCommit } from './gitBranchSha';

/**
 * Provide methods that must be implement by `GithubService` and `GitlabService` to interact with `git` repository
 */
export interface GitServiceInterface {
  /**
   * Update a specific commit's status according to the `gitCommitStatusInfos` param
   * @param gitCommitStatusInfos
   */
  updateCommitStatus(gitCommitStatusInfos: GitCommitStatusInfos): void;

  /**
   * Add a comment to a specific issue according to the `gitIssueInfos` param
   * @param gitIssueInfos
   */
  addIssueComment(gitIssueInfos: GitIssueInfos): void;

  /**
   * Add a comment to a specific Pull Request / Merge Request according to the `gitCommentPRInfos` param
   * @param gitCommentPRInfos
   */
  addPRComment(gitCommentPRInfos: GitCommentPRInfos): void;

  /**
   * Create a Pull Request / Merge Request whose attributes are specify by the `gitCreatePRInfos` param
   */
  createPullRequest(gitCreatePRInfos: GitPRInfos): void;

  /**
   * Delete the `brachName` branch
   */
  deleteBranch(branchName: string): void;

  /**
   * Create an Issue whose attributes are specify by the `gitCommitStatusInfos` param
   */
  createIssue(gitIssueInfos: GitIssueInfos): Promise<number>;

  /**
   * Update an issue partially
   */
  updateIssue(gitIssueInfos: GitIssueInfos): void;

  /**
   * Initialize `gitApi` and `gitToken` env. variables on new webhook
   * by reading the corresponding `config.env` file
   */
  setEnvironmentVariables(
    dataAccessService: DataAccessService,
    filePath: string,
  ): Promise<void>;

  /**
   * Remove a particular file describe in `gitFileInfos`
   */
  deleteFile(gitFileInfos: GitFileInfos): Promise<void>;

  /**
   * Merge a Pull Request specify in `gitMergePRInfos`
   */
  mergePullRequest(gitMergePRInfos: GitMergePRInfos): void;

  /**
   * Update a Pull Request partially
   */
  updatePullRequest(gitPRInfos: GitPRInfos): void;

  /**
   * Add a Webhook to the repository listening all events
   */
  createWebhook(webhookURL: string): void;

  /**
   * Get Issues with custom filters
   */
  getIssues(gitIssueSearch: GitIssuePRSearch): Promise<IssueSearchResult[]>;

  /**
   * Get Pull Requests with custom filters
   */
  getPullRequests(gitIssueSearch: GitIssuePRSearch): Promise<PRSearchResult[]>;

  createRelease(gitRelease: GitRelease): void;

  getLastBranchesCommitSha(): Promise<GitBranchCommit[]>;

  getFileContent(gitFileInfos: GitFileInfos): Promise<string>;
}
