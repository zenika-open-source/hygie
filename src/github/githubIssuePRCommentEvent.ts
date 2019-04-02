import {
  GithubIssue,
  GithubRepository,
  GithubComment,
} from './github.interface';

/**
 * GithubIssuePRCommentEvent dto
 */
export interface GithubIssuePRCommentEvent {
  action: string;
  issue: GithubIssue;
  repository: GithubRepository;
  comment: GithubComment;
}
