import {
  GitlabProject,
  GitlabComment,
  GitlabPR,
  GitlabUser,
} from './gitlab.interface';

/**
 * GitlabPRCommentEvent dto
 */
export interface GitlabPRCommentEvent {
  object_kind: string;
  event_type: string;
  merge_request: GitlabPR;
  project: GitlabProject;
  object_attributes: GitlabComment;
  user: GitlabUser;
}
