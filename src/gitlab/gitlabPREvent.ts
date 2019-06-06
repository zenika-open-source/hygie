import { GitlabProject, GitlabPR, GitlabUser } from './gitlab.interface';

/**
 * GitlabNewPREvent dto
 */
export interface GitlabPREvent {
  object_kind: string;
  project: GitlabProject;
  object_attributes: GitlabPR;
  user: GitlabUser;
}
