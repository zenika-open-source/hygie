export enum IssuePRStateEnum {
  Open = 'Open',
  Close = 'Close',
  All = 'All',
  Undefined = 'Undefined',
}

export enum IssueSortEnum {
  Asc = 'Asc',
  Desc = 'Desc',
}

/**
 * Provide all informations needed to interact with an Issue via a Git API
 */
export class GitIssueInfos {
  comment: string;
  number: string;
  title: string;
  state: IssuePRStateEnum;
  labels: string[];
  assignees: string[];
  description: string;
}

/**
 * Provide all search parameters to fetch Issues througth a Git API
 */
export class GitIssuePRSearch {
  sort: IssueSortEnum;
  state: IssuePRStateEnum;
}

export class IssueSearchResult {
  number: number;
  updatedAt: string;
}
