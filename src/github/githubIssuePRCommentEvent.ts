import {
  GithubIssue,
  GithubRepository,
  GithubComment,
  GithubSender,
} from './github.interface';

/**
 * GithubIssuePRCommentEvent dto
 */
export interface GithubIssuePRCommentEvent {
  action: string;
  issue: GithubIssue;
  repository: GithubRepository;
  comment: GithubComment;
  sender: GithubSender;
}
