import { GitlabPushEvent } from 'src/gitlab/gitlabPushEvent';
import { GithubPushEvent } from 'src/github/githubPushEvent';

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
  Tag = 2,
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
  git: GitlabPushEvent | GithubPushEvent,
): git is GitlabPushEvent {
  return (git as GitlabPushEvent).project_id !== undefined;
}

export function isGithubPushEvent(
  git: GitlabPushEvent | GithubPushEvent,
): git is GithubPushEvent {
  return (git as GithubPushEvent).repository.full_name !== undefined;
}
