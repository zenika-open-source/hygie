import { of } from 'rxjs';

export class MockHttpService {
  get: jest.Mock = jest.fn(() => {
    return of([]);
  });
  post: jest.Mock = jest.fn(() => {
    return of([]);
  });
  patch: jest.Mock = jest.fn(() => {
    return of([]);
  });
  put: jest.Mock = jest.fn(() => {
    return of([]);
  });
  delete: jest.Mock = jest.fn(() => {
    return of([]);
  });
}

export class MockGitlabService {
  mergePullRequest: jest.Mock = jest.fn().mockName('mergePullRequestGitlab');
  deleteFile: jest.Mock = jest.fn().mockName('deleteFileGitlab');
  createIssue: jest.Mock = jest.fn().mockName('createIssueGitlab');
  deleteBranch: jest.Mock = jest.fn().mockName('deleteBranchGitlab');
  updateIssue: jest.Mock = jest.fn().mockName('updateIssueGitlab');
  updateCommitStatus: jest.Mock = jest.fn();
  setEnvironmentVariables: jest.Mock = jest
    .fn()
    .mockName('setEnvironmentVariablesGitlab');
  addIssueComment: jest.Mock = jest.fn().mockName('addIssueCommentGitlab');
  addPRComment: jest.Mock = jest.fn().mockName('addPRCommentGitlab');
  createPullRequest: jest.Mock = jest.fn().mockName('createPullRequestGitlab');
}

export class MockGithubService {
  mergePullRequest: jest.Mock = jest.fn().mockName('mergePullRequestGithub');
  deleteFile: jest.Mock = jest.fn().mockName('deleteFileGithub');
  createIssue: jest.Mock = jest.fn().mockName('createIssueGithub');
  updateIssue: jest.Mock = jest.fn().mockName('updateIssueGithub');
  deleteBranch: jest.Mock = jest.fn().mockName('deleteBranchGithub');
  updateCommitStatus: jest.Mock = jest.fn();
  setEnvironmentVariables: jest.Mock = jest
    .fn()
    .mockName('setEnvironmentVariablesGithub');
  addIssueComment: jest.Mock = jest.fn().mockName('addIssueCommentGithub');
  addPRComment: jest.Mock = jest.fn().mockName('addPRCommentGithub');
  createPullRequest: jest.Mock = jest.fn().mockName('createPullRequestGithub');
}

export class MockSendEmailRunnable {
  run: jest.Mock = jest.fn(() => {
    return 'OK';
  });
}

export class MockObservable {
  subscribe: jest.Mock = jest.fn((next, error, complete?) => {
    return;
  });
}
