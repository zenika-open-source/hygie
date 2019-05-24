import { GitlabPushEvent } from '../gitlab/gitlabPushEvent';
import { GithubPushEvent } from '../github/githubPushEvent';
import { GithubBranchEvent } from '../github/githubBranchEvent';
import { GitlabEvent } from '../gitlab/gitlabEvent';
import { GithubEvent } from '../github/githubEvent';
import { GithubIssueEvent } from '../github/githubIssueEvent';
import { GitlabIssueEvent } from '../gitlab/gitlabIssueEvent';
import { GithubNewRepoEvent } from '../github/githubNewRepoEvent';
import { GithubPREvent } from '../github/githubPREvent';
import { GitlabPREvent } from '../gitlab/gitlabPREvent';
import { GithubIssuePRCommentEvent } from '../github/githubIssuePRCommentEvent';
import { GitlabIssueCommentEvent } from '../gitlab/gitlabIssueCommentEvent';
import { GitlabPRCommentEvent } from '../gitlab/gitlabPRCommentEvent';
import { IssuePRStateEnum } from '../git/gitIssueInfos';

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
  Undefined = 'Undefined',
  Push = 'Push',
  NewBranch = 'NewBranch',
  NewIssue = 'NewIssue',
  NewRepo = 'NewRepo',
  NewPR = 'NewPR',
  NewIssueComment = 'NewIssueComment',
  NewPRComment = 'NewPRComment',
  ClosedPR = 'ClosedPR',
  MergedPR = 'MergedPR',
  ReopenedPR = 'ReopenedPR',
  Cron = 'Cron',
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

export function convertIssueState(
  gitType: GitTypeEnum,
  issueStateEnum: IssuePRStateEnum,
): string {
  // tslint:disable-next-line:one-variable-per-declaration
  const IssueState = {
    [GitTypeEnum.Github]: {
      [IssuePRStateEnum.Open]: 'open',
      [IssuePRStateEnum.Close]: 'closed',
    },
    [GitTypeEnum.Gitlab]: {
      [IssuePRStateEnum.Open]: 'reopen',
      [IssuePRStateEnum.Close]: 'close',
    },
  };

  return IssueState[gitType][issueStateEnum];
}

export function convertIssueSearchState(
  gitType: GitTypeEnum,
  issueStateEnum: IssuePRStateEnum,
): string {
  // tslint:disable-next-line:one-variable-per-declaration
  const IssueState = {
    [GitTypeEnum.Github]: {
      [IssuePRStateEnum.Open]: 'open',
      [IssuePRStateEnum.Close]: 'closed',
      [IssuePRStateEnum.All]: 'all',
    },
    [GitTypeEnum.Gitlab]: {
      [IssuePRStateEnum.Open]: 'opened',
      [IssuePRStateEnum.Close]: 'closed',
      [IssuePRStateEnum.All]: 'all',
    },
  };

  return IssueState[gitType][issueStateEnum];
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
  return (git as GithubBranchEvent).ref_type === 'branch';
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

export function isGithubNewRepoEvent(
  git: GitlabEvent | GithubEvent,
): git is GithubNewRepoEvent {
  return (
    (git as GithubNewRepoEvent).repository !== undefined &&
    (git as GithubNewRepoEvent).sender !== undefined &&
    (git as GithubNewRepoEvent).action === 'created' &&
    (git as GithubIssueEvent).issue === undefined &&
    // tslint:disable-next-line:no-string-literal
    git['comment'] === undefined
  );
}

export function isGithubNewPREvent(
  git: GitlabEvent | GithubEvent,
): git is GithubPREvent {
  return (
    (git as GithubPREvent).pull_request !== undefined &&
    ((git as GithubPREvent).action === 'synchronised' ||
      (git as GithubPREvent).action === 'opened') &&
    (git as GithubPREvent).number !== undefined
  );
}

export function isGithubMergedPREvent(
  git: GitlabEvent | GithubEvent,
): git is GithubPREvent {
  return (
    (git as GithubPREvent).pull_request !== undefined &&
    (git as GithubPREvent).action === 'closed' &&
    (git as GithubPREvent).number !== undefined &&
    (git as GithubPREvent).pull_request.merged === true
  );
}

export function isGithubClosedPREvent(
  git: GitlabEvent | GithubEvent,
): git is GithubPREvent {
  return (
    (git as GithubPREvent).pull_request !== undefined &&
    (git as GithubPREvent).action === 'closed' &&
    (git as GithubPREvent).number !== undefined &&
    (git as GithubPREvent).pull_request.merged === false
  );
}

export function isGithubReopenedPREvent(
  git: GitlabEvent | GithubEvent,
): git is GithubPREvent {
  return (
    (git as GithubPREvent).pull_request !== undefined &&
    (git as GithubPREvent).action === 'reopened' &&
    (git as GithubPREvent).number !== undefined
  );
}

export function isGitlabNewPREvent(
  git: GitlabEvent | GithubEvent,
): git is GitlabPREvent {
  return (
    (git as GitlabPREvent).object_kind === 'merge_request' &&
    (git as GitlabPREvent).object_attributes !== undefined &&
    (git as GitlabPREvent).object_attributes.action === 'open'
  );
}

export function isGitlabMergedPREvent(
  git: GitlabEvent | GithubEvent,
): git is GitlabPREvent {
  return (
    (git as GitlabPREvent).object_kind === 'merge_request' &&
    (git as GitlabPREvent).object_attributes !== undefined &&
    (git as GitlabPREvent).object_attributes.action === 'merge'
  );
}

export function isGitlabClosedPREvent(
  git: GitlabEvent | GithubEvent,
): git is GitlabPREvent {
  return (
    (git as GitlabPREvent).object_kind === 'merge_request' &&
    (git as GitlabPREvent).object_attributes !== undefined &&
    (git as GitlabPREvent).object_attributes.action === 'close'
  );
}

export function isGitlabReopenedPREvent(
  git: GitlabEvent | GithubEvent,
): git is GitlabPREvent {
  return (
    (git as GitlabPREvent).object_kind === 'merge_request' &&
    (git as GitlabPREvent).object_attributes !== undefined &&
    (git as GitlabPREvent).object_attributes.action === 'reopen'
  );
}

export function isGithubIssueCommentEvent(
  git: GitlabEvent | GithubEvent,
): git is GithubIssuePRCommentEvent {
  return (
    (git as GithubIssuePRCommentEvent).issue !== undefined &&
    (git as GithubIssuePRCommentEvent).comment !== undefined &&
    (git as GithubIssuePRCommentEvent).repository !== undefined &&
    (git as GithubIssuePRCommentEvent).action !== undefined &&
    (git as GithubIssuePRCommentEvent).issue.pull_request === undefined
  );
}

export function isGithubPRCommentEvent(
  git: GitlabEvent | GithubEvent,
): git is GithubIssuePRCommentEvent {
  return (
    (git as GithubIssuePRCommentEvent).issue !== undefined &&
    (git as GithubIssuePRCommentEvent).comment !== undefined &&
    (git as GithubIssuePRCommentEvent).repository !== undefined &&
    (git as GithubIssuePRCommentEvent).action !== undefined &&
    (git as GithubIssuePRCommentEvent).issue.pull_request !== undefined
  );
}

export function isGitlabIssueCommentEvent(
  git: GitlabEvent | GithubEvent,
): git is GitlabIssueCommentEvent {
  return (
    (git as GitlabIssueCommentEvent).object_kind === 'note' &&
    (git as GitlabIssueCommentEvent).event_type === 'note' &&
    (git as GitlabIssueCommentEvent).object_attributes !== undefined &&
    (git as GitlabIssueCommentEvent).issue !== undefined &&
    (git as GitlabIssueCommentEvent).project !== undefined &&
    (git as GitlabPRCommentEvent).merge_request === undefined
  );
}

export function isGitlabPRCommentEvent(
  git: GitlabEvent | GithubEvent,
): git is GitlabPRCommentEvent {
  return (
    (git as GitlabPRCommentEvent).object_kind === 'note' &&
    (git as GitlabPRCommentEvent).event_type === 'note' &&
    (git as GitlabPRCommentEvent).object_attributes !== undefined &&
    (git as GitlabPRCommentEvent).merge_request !== undefined &&
    (git as GitlabPRCommentEvent).project !== undefined &&
    (git as GitlabIssueCommentEvent).issue === undefined
  );
}
