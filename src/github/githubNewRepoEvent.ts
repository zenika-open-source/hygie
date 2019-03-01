import { GithubRepository, GithubSender } from './github.interface';

export interface GithubNewRepoEvent {
  action: string;
  repository: GithubRepository;
  sender: GithubSender;
}
