export interface GithubIssue {
  number: number;
  title: string;
}

export interface GithubIssueEvent {
  action: string;
  issue: GithubIssue;
}
