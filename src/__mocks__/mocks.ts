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
  createRelease: jest.Mock = jest.fn().mockName('createReleaseGitlab');
  getLastCommit: jest.Mock = jest.fn().mockName('getLastCommitGitlab');
  createTag: jest.Mock = jest.fn().mockName('createTagGitlab');
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
  createRelease: jest.Mock = jest.fn().mockName('createReleaseGithub');

  getTree: jest.Mock = jest
    .fn()
    .mockName('getTreeGithub')
    .mockResolvedValue('tree');

  getLastCommit: jest.Mock = jest
    .fn()
    .mockName('getLastCommitGithub')
    .mockResolvedValue('commit');
  createCommit: jest.Mock = jest
    .fn()
    .mockName('createCommitGithub')
    .mockResolvedValue('createdCommit');

  updateRef: jest.Mock = jest.fn().mockName('updateRefGithub');
  createTag: jest.Mock = jest
    .fn()
    .mockName('createTagGithub')
    .mockResolvedValue('tag');

  createRef: jest.Mock = jest.fn().mockName('createRefGithub');
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
  writeCron: jest.Mock = jest
    .fn()
    .mockName('writeCron')
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

  readCron: jest.Mock = jest
    .fn()
    .mockName('readCron')
    .mockImplementation((...args) => {
      return new Promise((resolve, reject) => {
        resolve('some cron content...');
      });
    });

  connect: jest.Mock = jest.fn().mockName('connect');

  getAllCrons: jest.Mock = jest
    .fn()
    .mockName('getAllCrons')
    .mockImplementation((...args) => {
      return new Promise((resolve, reject) => {
        resolve('all cron content...');
      });
    });

  removeAllCrons: jest.Mock = jest
    .fn()
    .mockName('removeAllCrons')
    .mockImplementation((...args) => {
      return new Promise((resolve, reject) => {
        resolve(true);
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

  readCollection(source: SourceEnum, path: string): Promise<any> {
    return Promise.resolve([{}]);
  }

  removeCollection(source: SourceEnum, path: string): Promise<boolean> {
    return Promise.resolve(true);
  }
}
