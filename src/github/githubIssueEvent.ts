import { GithubRepository, GithubIssue } from './github.interface';

export interface GithubIssueEvent {
  action: string;
  issue: GithubIssue;
  repository: GithubRepository;
}
