import {
  GithubRepository,
  GithubPullRequest,
  GithubSender,
} from './github.interface';

/**
 * GithubNewPREvent dto
 */
export interface GithubPREvent {
  action: string;
  pull_request: GithubPullRequest;
  repository: GithubRepository;
  number: number;
  sender: GithubSender;
}
