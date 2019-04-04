import { GithubPushEvent } from './githubPushEvent';
import { GithubBranchEvent } from './githubBranchEvent';
import { GithubIssueEvent } from './githubIssueEvent';
import { GithubNewRepoEvent } from './githubNewRepoEvent';
import { GithubNewPREvent } from './githubNewPREvent';
import { GithubIssuePRCommentEvent } from './githubIssuePRCommentEvent';

/**
 * All Github Events supported by our API
 */
export type GithubEvent =
  | GithubPushEvent
  | GithubBranchEvent
  | GithubIssueEvent
  | GithubNewRepoEvent
  | GithubNewPREvent
  | GithubIssuePRCommentEvent;
