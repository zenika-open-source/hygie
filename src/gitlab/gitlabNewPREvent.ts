import { GitlabProject, GitlabPR } from './gitlab.interface';

export interface GitlabNewPREvent {
  object_kind: string;
  repository: GitlabProject;
  object_attributes: GitlabPR;
}
