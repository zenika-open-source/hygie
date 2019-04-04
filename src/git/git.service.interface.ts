import { GitCommitStatusInfos } from './gitCommitStatusInfos';
import { GitApiInfos } from './gitApiInfos';
import { GitIssueInfos } from './gitIssueInfos';
import { GitCommentPRInfos, GitCreatePRInfos } from './gitPRInfos';

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
    gitCreatePRInfos: GitCreatePRInfos,
  ): void;

  /**
   * Delete the `brachName` branch
   */
  deleteBranch(gitApiInfos: GitApiInfos, branchName: string): void;

  /**
   * Update an issue partially
   */
  updateIssue(gitApiInfos: GitApiInfos, gitIssueInfos: GitIssueInfos): void;

  /**
   * Initialize `gitApi` and `gitToken` env. variables on new webhook
   * by reading the corresponding `config.env` file
   */
  setEnvironmentVariables(filePath: string): void;
}
