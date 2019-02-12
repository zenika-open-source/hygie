export interface GitlabCommit {
  message: string;
  id: string;
}
export interface GitlabPushEvent {
  commits: GitlabCommit[];
  // tslint:disable-next-line:variable-name
  project_id: number;
  before: string;
  ref: string;
}
