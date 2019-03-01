import { GithubRepository, GithubPullRequest } from './github.interface';

export interface GithubNewPREvent {
  action: string;
  pull_request: GithubPullRequest;
  repository: GithubRepository;
  number: number;
}
