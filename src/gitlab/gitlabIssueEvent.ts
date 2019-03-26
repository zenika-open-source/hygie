import { GitlabIssue, GitlabProject } from './gitlab.interface';

/**
 * GitlabIssueEvent dto
 */
export interface GitlabIssueEvent {
  object_kind: string;
  event_type: string;
  object_attributes: GitlabIssue;
  project: GitlabProject;
}
