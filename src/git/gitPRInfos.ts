export class GitCommentPRInfos {
  comment: string;
  number: string;
}

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
