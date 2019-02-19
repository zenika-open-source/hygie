export interface GitlabIssue {
  iid: number;
  title: string;
}

export interface GitlabIssueEvent {
  object_kind: string;
  event_type: string;
  object_attributes: GitlabIssue;
}
