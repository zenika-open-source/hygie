import { GitlabProject, GitlabPR } from './gitlab.interface';

/**
 * GitlabNewPREvent dto
 */
export interface GitlabNewPREvent {
  object_kind: string;
  project: GitlabProject;
  object_attributes: GitlabPR;
}
