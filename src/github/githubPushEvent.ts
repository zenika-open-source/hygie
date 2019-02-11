export interface GithubCommit {
  message: string;
  id: string;
}
export interface GithubRepository {
  full_name: string;
}
export class GithubPushEvent {
  commits: GithubCommit[];
  repository: GithubRepository;
}
