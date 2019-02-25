import { GithubPushEvent } from './githubPushEvent';
import { GithubBranchEvent } from './githubBranchEvent';
import { GithubIssueEvent } from './githubIssueEvent';
import { GithubNewRepoEvent } from './githubNewRepoEvent';

export type GithubEvent =
  | GithubPushEvent
  | GithubBranchEvent
  | GithubIssueEvent
  | GithubNewRepoEvent;
