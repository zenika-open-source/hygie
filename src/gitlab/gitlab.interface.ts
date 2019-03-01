export interface GitlabIssue {
  iid: number;
  title: string;
  project_id: number;
}
export interface GitlabCommit {
  message: string;
  id: string;
}
export interface GitlabPR {
  action: string;
  title: string;
  iid: number;
  description: string;
}
export interface GitlabProject {
  id: number;
  name: string;
}
