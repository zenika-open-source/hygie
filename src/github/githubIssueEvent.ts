export interface GithubIssue {
  number: number;
  title: string;
}
export interface GithubRepository {
  full_name: string;
}
export interface GithubIssueEvent {
  action: string;
  issue: GithubIssue;
  repository: GithubRepository;
}
