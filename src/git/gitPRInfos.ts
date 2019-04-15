import { IssuePRStateEnum } from './gitIssueInfos';

/**
 * Provide all informations needed to interact with a Pull Request / Merge Request via a git API
 */
export class GitCommentPRInfos {
  comment: string;
  number: string;
}

/**
 * Provide all informations needed to create a Pull Request / Merge Request via a git API
 */
export class GitPRInfos {
  title: string;
  description: string;
  source: string;
  target: string;
  state?: IssuePRStateEnum;
  number?: number;

  constructor() {
    this.title = '';
    this.description = '';
    this.source = '';
    this.description = '';
  }
}

/**
 * All supported methods to "merge" a Pull Request / Merge Request
 */
export enum PRMethodsEnum {
  Merge = 'Merge',
  Squash = 'Squash',
  Rebase = 'Rebase',
}

/**
 * Provide all informations needed to merge a Pull Request / Merge Request via a git API
 */
export class GitMergePRInfos {
  number: number;
  commitTitle: string;
  commitMessage: string;
  method: PRMethodsEnum;
  sha: string;
}
