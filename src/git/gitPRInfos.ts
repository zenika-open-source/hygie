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
export class GitCreatePRInfos {
  title: string;
  description: string;
  source: string;
  target: string;

  constructor() {
    this.title = '';
    this.description = '';
    this.source = '';
    this.description = '';
  }
}
