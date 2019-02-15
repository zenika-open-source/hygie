export interface GithubCommit {
  message: string;
  id: string;
}
export interface GithubRepository {
  full_name: string;
}
export interface GithubPushEvent {
  commits: GithubCommit[];
  repository: GithubRepository;
}
