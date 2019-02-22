import { GitlabPushEvent } from './gitlabPushEvent';
import { GitlabIssueEvent } from './gitlabIssueEvent';

export type GitlabEvent = GitlabPushEvent | GitlabIssueEvent;
