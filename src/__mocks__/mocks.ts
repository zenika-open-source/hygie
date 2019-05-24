import { of } from 'rxjs';
import {
  DataAccessInterface,
  SourceEnum,
} from '../data_access/dataAccess.interface';

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
  createWebhook: jest.Mock = jest.fn().mockName('createWebhookGitlab');
  getIssues: jest.Mock = jest.fn().mockName('getIssuesGitlab');
  getPullRequests: jest.Mock = jest.fn().mockName('getPullRequestsGitlab');
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
  createWebhook: jest.Mock = jest.fn().mockName('createWebhookGithub');
  getIssues: jest.Mock = jest.fn().mockName('getIssuesGithub');
  getPullRequests: jest.Mock = jest.fn().mockName('getPullRequestsGithub');
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
    .mockName('checkIfEnvExist')
    .mockImplementation((...args) => {
      return new Promise((resolve, reject) => {
        resolve(true);
      });
    });

  checkIfRuleExist: jest.Mock = jest
    .fn()
    .mockName('checkIfRuleExist')
    .mockImplementation((...args) => {
      return new Promise((resolve, reject) => {
        resolve(true);
      });
    });

  readEnv: jest.Mock = jest
    .fn()
    .mockName('readEnv')
    .mockImplementation((...args) => {
      return new Promise((resolve, reject) => {
        resolve({ gitApi: 'myAPI', gitToken: 'myToken' });
      });
    });

  readRule: jest.Mock = jest
    .fn()
    .mockName('readRule')
    .mockImplementation((...args) => {
      return new Promise((resolve, reject) => {
        resolve('some rule content...');
      });
    });
}

export class MockDataAccess implements DataAccessInterface {
  checkIfExist(source: SourceEnum, path: string): Promise<boolean> {
    return Promise.resolve(true);
  }

  readData(source: SourceEnum, path: string): Promise<any> {
    return Promise.resolve('some data');
  }

  writeData(source: SourceEnum, path: string, data: any): Promise<any> {
    return Promise.resolve('ok');
  }

  connect(): Promise<boolean> {
    return Promise.resolve(true);
  }
}
