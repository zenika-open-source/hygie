export interface GithubIssue {
  number: number;
  title: string;
}
export interface GithubRepository {
  full_name: string;
  name: string;
  description: string;
}
export interface GithubCommit {
  message: string;
  id: string;
}
export interface GithubSender {
  login: string;
}
export interface GithubPullRequest {
  state: string;
  title: string;
}
