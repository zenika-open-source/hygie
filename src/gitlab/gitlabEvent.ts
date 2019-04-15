import { GitlabPushEvent } from './gitlabPushEvent';
import { GitlabIssueEvent } from './gitlabIssueEvent';
import { GitlabPREvent } from './gitlabPREvent';
import { GitlabIssueCommentEvent } from './gitlabIssueCommentEvent';
import { GitlabPRCommentEvent } from './gitlabPRCommentEvent';

/**
 * All Gitlab Events supported by our API
 */
export type GitlabEvent =
  | GitlabPushEvent
  | GitlabIssueEvent
  | GitlabPREvent
  | GitlabIssueCommentEvent
  | GitlabPRCommentEvent;
