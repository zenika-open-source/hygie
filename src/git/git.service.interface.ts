import { GitCommitStatusInfos } from './gitCommitStatusInfos';
import { GitApiInfos } from './gitApiInfos';
import { GitIssueInfos } from './gitIssueInfos';

export interface GitServiceInterface {
  updateCommitStatus(
    gitApiInfos: GitApiInfos,
    gitCommitStatusInfos: GitCommitStatusInfos,
  ): void;

  addIssueComment(gitApiInfos: GitApiInfos, gitIssueInfos: GitIssueInfos): void;
}
