/**
 * GithubIssue dto
 */
export interface GithubIssue {
  number: number;
  title: string;
}
/**
 * GithubRepository dto
 */
export interface GithubRepository {
  full_name: string;
  name: string;
  description: string;
}
/**
 * GithubCommit dto
 */
export interface GithubCommit {
  message: string;
  id: string;
}
/**
 * GithubSender dto
 */
export interface GithubSender {
  login: string;
}
/**
 * GithubPullRequest dto
 */
export interface GithubPullRequest {
  state: string;
  title: string;
  body: string;
}
