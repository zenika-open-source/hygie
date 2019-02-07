import { GithubPushEvent } from './githubPushEvent';
import { GithubBranchEvent } from './githubBranchEvent';

export type GithubEvent = GithubPushEvent | GithubBranchEvent;
