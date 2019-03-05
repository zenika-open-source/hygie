import { GitCommitStatusInfos } from './gitCommitStatusInfos';
import { GitApiInfos } from './gitApiInfos';
import { GitIssueInfos } from './gitIssueInfos';
import { GitCommentPRInfos, GitCreatePRInfos } from './gitPRInfos';

/**
 * Provide methods that must be implement by `GithubService` and `GitlabService` to interact with `git` repository
 */
export interface GitServiceInterface {
  updateCommitStatus(
    gitApiInfos: GitApiInfos,
    gitCommitStatusInfos: GitCommitStatusInfos,
  ): void;

  addIssueComment(gitApiInfos: GitApiInfos, gitIssueInfos: GitIssueInfos): void;

  addPRComment(
    gitApiInfos: GitApiInfos,
    gitCommentPRInfos: GitCommentPRInfos,
  ): void;

  createPullRequest(
    gitApiInfos: GitApiInfos,
    gitCreatePRInfos: GitCreatePRInfos,
  ): void;
}
