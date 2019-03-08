import { GithubRepository, GithubIssue } from './github.interface';

/**
 * GithubIssueEvent dto
 */
export interface GithubIssueEvent {
  action: string;
  issue: GithubIssue;
  repository: GithubRepository;
}
