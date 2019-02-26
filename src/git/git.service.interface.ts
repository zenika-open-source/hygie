import { GitCommitStatusInfos } from './gitCommitStatusInfos';
import { GitApiInfos } from './gitApiInfos';
import { GitIssueInfos } from './gitIssueInfos';
import { GitPRInfos } from './gitPRInfos';

export interface GitServiceInterface {
  updateCommitStatus(
    gitApiInfos: GitApiInfos,
    gitCommitStatusInfos: GitCommitStatusInfos,
  ): void;

  addIssueComment(gitApiInfos: GitApiInfos, gitIssueInfos: GitIssueInfos): void;

  addPRComment(gitApiInfos: GitApiInfos, gitPRInfos: GitPRInfos): void;
}
