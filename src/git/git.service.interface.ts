import { GitCommitStatusInfos } from './gitCommitStatusInfos';
import { GitApiInfos } from './gitApiInfos';
import {
  GitIssueInfos,
  GitIssuePRSearch,
  IssueSearchResult,
} from './gitIssueInfos';
import { GitCommentPRInfos, GitPRInfos, GitMergePRInfos } from './gitPRInfos';
import { GitFileInfos } from './gitFileInfos';
import { DataAccessService } from '../data_access/dataAccess.service';

/**
 * Provide methods that must be implement by `GithubService` and `GitlabService` to interact with `git` repository
 */
export interface GitServiceInterface {
  /**
   * Update a specific commit's status according to the `gitCommitStatusInfos` param
   * @param gitApiInfos
   * @param gitCommitStatusInfos
   */
  updateCommitStatus(
    gitApiInfos: GitApiInfos,
    gitCommitStatusInfos: GitCommitStatusInfos,
  ): void;

  /**
   * Add a comment to a specific issue according to the `gitIssueInfos` param
   * @param gitApiInfos
   * @param gitIssueInfos
   */
  addIssueComment(gitApiInfos: GitApiInfos, gitIssueInfos: GitIssueInfos): void;

  /**
   * Add a comment to a specific Pull Request / Merge Request according to the `gitCommentPRInfos` param
   * @param gitApiInfos
   * @param gitCommentPRInfos
   */
  addPRComment(
    gitApiInfos: GitApiInfos,
    gitCommentPRInfos: GitCommentPRInfos,
  ): void;

  /**
   * Create a Pull Request / Merge Request whose attributes are specify by the `gitCreatePRInfos` param
   */
  createPullRequest(
    gitApiInfos: GitApiInfos,
    gitCreatePRInfos: GitPRInfos,
  ): void;

  /**
   * Delete the `brachName` branch
   */
  deleteBranch(gitApiInfos: GitApiInfos, branchName: string): void;

  /**
   * Create an Issue whose attributes are specify by the `gitCommitStatusInfos` param
   */
  createIssue(gitApiInfos: GitApiInfos, gitIssueInfos: GitIssueInfos): void;

  /**
   * Update an issue partially
   */
  updateIssue(gitApiInfos: GitApiInfos, gitIssueInfos: GitIssueInfos): void;

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
  deleteFile(
    gitApiInfos: GitApiInfos,
    gitFileInfos: GitFileInfos,
  ): Promise<void>;

  /**
   * Merge a Pull Request specify in `gitMergePRInfos`
   */
  mergePullRequest(
    gitApiInfos: GitApiInfos,
    gitMergePRInfos: GitMergePRInfos,
  ): void;

  /**
   * Update a Pull Request partially
   */
  updatePullRequest(gitApiInfos: GitApiInfos, gitPRInfos: GitPRInfos): void;

  /**
   * Add a Webhook to the repository listening all events
   */
  createWebhook(gitApiInfos: GitApiInfos, webhookURL: string): void;

  /**
   * Get Issues
   */
  getIssues(
    gitApiInfos: GitApiInfos,
    gitIssueSearch: GitIssuePRSearch,
  ): Promise<IssueSearchResult[]>;
}
