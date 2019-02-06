export interface GitlabCommit {
  message: string;
  id: string;
}
export class GitlabPushEvent {
  commits: GitlabCommit[];
  // tslint:disable-next-line:variable-name
  project_id: number;
}
