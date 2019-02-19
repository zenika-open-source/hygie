export interface GitlabCommit {
  message: string;
  id: string;
}
export interface GitlabPushEvent {
  commits: GitlabCommit[];
  project_id: number;
  before: string;
  ref: string;
}
