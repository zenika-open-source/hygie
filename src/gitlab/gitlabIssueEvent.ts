export interface GitlabIssue {
  iid: number;
  title: string;
  project_id: number;
}

export interface GitlabIssueEvent {
  object_kind: string;
  event_type: string;
  object_attributes: GitlabIssue;
}
