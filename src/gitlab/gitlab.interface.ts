/**
 * GitlabIssue dto
 */
export interface GitlabIssue {
  iid: number;
  title: string;
  project_id: number;
}
/**
 * GitlabCommit dto
 */
export interface GitlabCommit {
  message: string;
  id: string;
}
/**
 * GitlabPR dto
 */
export interface GitlabPR {
  action: string;
  title: string;
  iid: number;
  description: string;
}
/**
 * GitlabProject dto
 */
export interface GitlabProject {
  id: number;
  name: string;
  git_http_url: string;
}
