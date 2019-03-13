import { of } from 'rxjs';

export class MockHttpService {
  get: jest.Mock = jest.fn(() => {
    return of([]);
  });
  post: jest.Mock = jest.fn(() => {
    return of([]);
  });
}

export class MockGitlabService {
  updateCommitStatus: jest.Mock = jest.fn();
  addIssueComment: jest.Mock = jest.fn().mockName('addIssueCommentGitlab');
  addPRComment: jest.Mock = jest.fn().mockName('addPRCommentGitlab');
  createPullRequest: jest.Mock = jest.fn().mockName('createPullRequestGitlab');
}

export class MockGithubService {
  updateCommitStatus: jest.Mock = jest.fn();
  addIssueComment: jest.Mock = jest.fn().mockName('addIssueCommentGithub');
  addPRComment: jest.Mock = jest.fn().mockName('addPRCommentGithub');
  createPullRequest: jest.Mock = jest.fn().mockName('createPullRequestGithub');
}

export class MockSendEmailRunnable {
  run: jest.Mock = jest.fn(() => {
    return 'OK';
  });
}
