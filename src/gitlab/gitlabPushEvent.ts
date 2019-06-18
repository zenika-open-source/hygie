import { GitlabCommit, GitlabProject } from './gitlab.interface';

/**
 * GitlabPushEvent dto
 */
export interface GitlabPushEvent {
  commits: GitlabCommit[];
  project_id: number;
  before: string;
  after: string;
  ref: string;
  object_kind: string;
  project: GitlabProject;
  user_username: string;
}
