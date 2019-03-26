import { GitlabCommit, GitlabProject } from './gitlab.interface';

/**
 * GitlabPushEvent dto
 */
export interface GitlabPushEvent {
  commits: GitlabCommit[];
  project_id: number;
  before: string;
  ref: string;
  object_kind: string;
  project: GitlabProject;
}
