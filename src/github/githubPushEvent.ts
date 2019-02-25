import { GithubCommit, GithubRepository } from './github.interface';

export interface GithubPushEvent {
  commits: GithubCommit[];
  repository: GithubRepository;
}
