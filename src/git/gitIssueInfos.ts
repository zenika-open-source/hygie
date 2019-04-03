export enum IssueStateEnum {
  Open = 'Open',
  Close = 'Close',
}

/**
 * Provide all informations needed to interact with an Issue via a git API
 */
export class GitIssueInfos {
  comment: string;
  number: string;
  title: string;
  state: IssueStateEnum;
}
