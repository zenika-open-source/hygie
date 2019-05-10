import { GitlabIssue, GitlabProject, GitlabComment } from './gitlab.interface';

/**
 * GitlabIssueCommentEvent dto
 */
export interface GitlabIssueCommentEvent {
  object_kind: string;
  event_type: string;
  issue: GitlabIssue;
  project: GitlabProject;
  object_attributes: GitlabComment;
}
