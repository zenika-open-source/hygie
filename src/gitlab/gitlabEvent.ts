import { GitlabPushEvent } from './gitlabPushEvent';
import { GitlabIssueEvent } from './gitlabIssueEvent';
import { GitlabNewPREvent } from './gitlabNewPREvent';

export type GitlabEvent = GitlabPushEvent | GitlabIssueEvent | GitlabNewPREvent;
