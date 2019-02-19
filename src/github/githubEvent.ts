import { GithubPushEvent } from './githubPushEvent';
import { GithubBranchEvent } from './githubBranchEvent';
import { GithubIssueEvent } from './githubIssueEvent';

export type GithubEvent =
  | GithubPushEvent
  | GithubBranchEvent
  | GithubIssueEvent;
