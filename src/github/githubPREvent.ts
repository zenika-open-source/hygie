import { GithubRepository, GithubPullRequest } from './github.interface';

/**
 * GithubNewPREvent dto
 */
export interface GithubPREvent {
  action: string;
  pull_request: GithubPullRequest;
  repository: GithubRepository;
  number: number;
}
