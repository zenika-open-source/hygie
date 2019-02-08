import { GitlabPushEvent } from 'src/gitlab/gitlabPushEvent';
import { GithubPushEvent } from 'src/github/githubPushEvent';
import { GithubBranchEvent } from 'src/github/githubBranchEvent';

export enum GitTypeEnum {
  Undefined = 0,
  Github = 1,
  Gitlab = 2,
}

export enum CommitStatusEnum {
  Success = 1,
  Failure = 2,
}

export enum GitEventEnum {
  Push = 1,
  NewBranch = 2,
}

export function convertCommitStatus(
  gitType: GitTypeEnum,
  commitStatus: CommitStatusEnum,
): string {
  // tslint:disable-next-line:one-variable-per-declaration
  const GitCommitStatus = {
    [GitTypeEnum.Github]: {
      [CommitStatusEnum.Success]: 'success',
      [CommitStatusEnum.Failure]: 'failure',
    },
    [GitTypeEnum.Gitlab]: {
      [CommitStatusEnum.Success]: 'success',
      [CommitStatusEnum.Failure]: 'failed',
    },
  };

  return GitCommitStatus[gitType][commitStatus];
}

export function isGitlabPushEvent(
  git: GitlabPushEvent | GithubPushEvent | GithubBranchEvent,
): git is GitlabPushEvent {
  return (git as GitlabPushEvent).project_id !== undefined;
}

export function isGithubPushEvent(
  git: GitlabPushEvent | GithubPushEvent | GithubBranchEvent,
): git is GithubPushEvent {
  if ((git as GithubPushEvent).repository !== undefined) {
    return (
      (git as GithubPushEvent).repository.full_name !== undefined &&
      (git as GithubBranchEvent).ref_type === undefined
    );
  }
  return false;
}

export function isGithubBranchEvent(
  git: GitlabPushEvent | GithubPushEvent | GithubBranchEvent,
): git is GithubBranchEvent {
  return (git as GithubBranchEvent).ref_type !== undefined;
}
