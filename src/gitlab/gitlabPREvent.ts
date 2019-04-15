import { GitlabProject, GitlabPR } from './gitlab.interface';

/**
 * GitlabNewPREvent dto
 */
export interface GitlabPREvent {
  object_kind: string;
  project: GitlabProject;
  object_attributes: GitlabPR;
}
