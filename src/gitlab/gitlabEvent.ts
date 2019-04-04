import { GitlabPushEvent } from './gitlabPushEvent';
import { GitlabIssueEvent } from './gitlabIssueEvent';
import { GitlabNewPREvent } from './gitlabNewPREvent';
import { GitlabIssueCommentEvent } from './gitlabIssueCommentEvent';
import { GitlabPRCommentEvent } from './gitlabPRCommentEvent';

/**
 * All Gitlab Events supported by our API
 */
export type GitlabEvent =
  | GitlabPushEvent
  | GitlabIssueEvent
  | GitlabNewPREvent
  | GitlabIssueCommentEvent
  | GitlabPRCommentEvent;
