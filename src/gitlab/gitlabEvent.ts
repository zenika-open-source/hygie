import { GitlabPushEvent } from './gitlabPushEvent';
import { GitlabIssueEvent } from './gitlabIssueEvent';
import { GitlabNewPREvent } from './gitlabNewPREvent';

/**
 * All Gitlab Events supported by our API
 */
export type GitlabEvent = GitlabPushEvent | GitlabIssueEvent | GitlabNewPREvent;
