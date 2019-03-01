import { GitlabCommit } from './gitlab.interface';

export interface GitlabPushEvent {
  commits: GitlabCommit[];
  project_id: number;
  before: string;
  ref: string;
  object_kind: string;
}
