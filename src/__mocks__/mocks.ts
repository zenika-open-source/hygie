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
  head: jest.Mock = jest.fn(() => {
    return of([]);
  });
}

export class MockGitlabService {
  updatePullRequest: jest.Mock = jest.fn().mockName('updatePullRequestGitlab');
  mergePullRequest: jest.Mock = jest.fn().mockName('mergePullRequestGitlab');
  deleteFile: jest.Mock = jest
    .fn()
    .mockName('deleteFileGitlab')
    .mockImplementation((...args) => {
      return new Promise((resolve, reject) => {
        resolve();
      });
    });
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
  updatePullRequest: jest.Mock = jest.fn().mockName('updatePullRequestGithub');
  mergePullRequest: jest.Mock = jest.fn().mockName('mergePullRequestGithub');
  deleteFile: jest.Mock = jest
    .fn()
    .mockName('deleteFileGithub')
    .mockImplementation((...args) => {
      return new Promise((resolve, reject) => {
        resolve();
      });
    });
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

export class MockDataAccessService {
  writeEnv: jest.Mock = jest
    .fn()
    .mockName('writeEnv')
    .mockImplementation((...args) => {
      return new Promise((resolve, reject) => {
        resolve();
      });
    });
  writeRule: jest.Mock = jest
    .fn()
    .mockName('writeRule')
    .mockImplementation((...args) => {
      return new Promise((resolve, reject) => {
        resolve();
      });
    });
  checkIfEnvExist: jest.Mock = jest
    .fn()
    .mockName('writeRule')
    .mockImplementation((...args) => {
      return new Promise((resolve, reject) => {
        resolve(true);
      });
    });
}
