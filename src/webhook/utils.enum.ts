import { GitlabPushEvent } from '../gitlab/gitlabPushEvent';
import { GithubPushEvent } from '../github/githubPushEvent';
import { GithubBranchEvent } from '../github/githubBranchEvent';
import { GitlabEvent } from '../gitlab/gitlabEvent';
import { GithubEvent } from '../github/githubEvent';
import { GithubIssueEvent } from '../github/githubIssueEvent';
import { GitlabIssueEvent } from '../gitlab/gitlabIssueEvent';

export enum GitTypeEnum {
  Undefined = 'Undefined',
  Github = 'Github',
  Gitlab = 'Gitlab',
}

export enum CommitStatusEnum {
  Success = 'Success',
  Failure = 'Failure',
}

export enum GitEventEnum {
  Push = 'Push',
  NewBranch = 'NewBranch',
  NewIssue = 'NewIssue',
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
  git: GitlabEvent | GithubEvent,
): git is GitlabPushEvent {
  return (
    (git as GitlabPushEvent).project_id !== undefined &&
    (git as GitlabPushEvent).before !==
      '0000000000000000000000000000000000000000' &&
    (git as GitlabPushEvent).object_kind === 'push'
  );
}

export function isGithubPushEvent(
  git: GitlabEvent | GithubEvent,
): git is GithubPushEvent {
  if ((git as GithubPushEvent).repository !== undefined) {
    return (
      (git as GithubPushEvent).repository.full_name !== undefined &&
      (git as GithubPushEvent).commits !== undefined &&
      (git as GithubBranchEvent).ref_type === undefined
    );
  }
  return false;
}

export function isGithubBranchEvent(
  git: GitlabEvent | GithubEvent,
): git is GithubBranchEvent {
  return (git as GithubBranchEvent).ref_type !== undefined;
}

export function isGitlabBranchEvent(
  git: GitlabEvent | GithubEvent,
): git is GitlabPushEvent {
  return (
    (git as GitlabPushEvent).project_id !== undefined &&
    (git as GitlabPushEvent).before ===
      '0000000000000000000000000000000000000000'
  );
}

export function isGithubIssueEvent(
  git: GitlabEvent | GithubEvent,
): git is GithubIssueEvent {
  return (
    (git as GithubIssueEvent).issue !== undefined &&
    (git as GithubIssueEvent).action === 'opened'
  );
}

export function isGitlabIssueEvent(
  git: GitlabEvent | GithubEvent,
): git is GitlabIssueEvent {
  return (git as GitlabIssueEvent).object_kind === 'issue';
}
