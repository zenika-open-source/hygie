import { GithubCommit, GithubRepository } from './github.interface';

/**
 * GithubPushEvent dto
 */
export interface GithubPushEvent {
  commits: GithubCommit[];
  repository: GithubRepository;
  ref: string;
}
