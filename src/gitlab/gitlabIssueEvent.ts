import { GitlabIssue } from './gitlab.interface';

export interface GitlabIssueEvent {
  object_kind: string;
  event_type: string;
  object_attributes: GitlabIssue;
}
