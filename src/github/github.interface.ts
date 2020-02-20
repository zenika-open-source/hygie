/**
 * GithubIssue dto
 */
export interface GithubIssue {
  pull_request?: any;
  number: number;
  title: string;
  body: string;
}
/**
 * GithubRepository dto
 */
export interface GithubRepository {
  full_name: string;
  name: string;
  description: string;
  html_url: string;
  default_branch: string;
}
/**
 * GithubCommit dto
 */
export interface GithubCommit {
  message: string;
  id: string;
  added: string[];
  modified: string[];
  removed: string[];
}
/**
 * GithubSender dto
 */
export interface GithubSender {
  login: string;
}

/**
 * GithubHeadPR dto
 */
export interface GithubHeadPR {
  ref: string;
}

/**
 * GithubBasePR dto
 */
export interface GithubBasePR {
  ref: string;
}

/**
 * GithubUserPR dto
 */
export interface GithubUserPR {
  login: string;
}

/**
 * GithubPullRequest dto
 */
export interface GithubPullRequest {
  state: string;
  title: string;
  body: string;
  merged: boolean;
  head: GithubHeadPR;
  base: GithubBasePR;
  user: GithubUserPR;
}

/**
 * GithubComment dto
 */
export interface GithubComment {
  id: number;
  body: string;
}
