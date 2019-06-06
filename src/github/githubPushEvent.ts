import {
  GithubCommit,
  GithubRepository,
  GithubSender,
} from './github.interface';

/**
 * GithubPushEvent dto
 */
export interface GithubPushEvent {
  commits: GithubCommit[];
  repository: GithubRepository;
  ref: string;
  sender: GithubSender;
}
