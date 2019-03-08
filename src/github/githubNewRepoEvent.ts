import { GithubRepository, GithubSender } from './github.interface';

/**
 * GithubNewRepoEvent dto
 */
export interface GithubNewRepoEvent {
  action: string;
  repository: GithubRepository;
  sender: GithubSender;
}
