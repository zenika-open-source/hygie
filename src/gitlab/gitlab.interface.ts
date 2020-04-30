/**
 * GitlabIssue dto
 */
export interface GitlabIssue {
  iid: number;
  title: string;
  project_id: number;
  description: string;
}
/**
 * GitlabCommit dto
 */
export interface GitlabCommit {
  message: string;
  id: string;
  added: string[];
  modified: string[];
  removed: string[];
}
/**
 * GitlabSourcePR dto
 */
export interface GitlabSourcePR {
  namespace: string;
}
/**
 * GitlabPR dto
 */
export interface GitlabPR {
  action?: string;
  title: string;
  iid: number;
  description: string;
  source_branch: string;
  target_branch: string;
  source: GitlabSourcePR;
}
/**
 * GitlabProject dto
 */
export interface GitlabProject {
  id: number;
  name: string;
  web_url: string;
  default_branch: string;
}
/**
 * GitlabComment dto
 */
export interface GitlabComment {
  id: number;
  note: string;
  description: string;
}

/**
 * GitlabUser dto
 */
export interface GitlabUser {
  username: string;
}
