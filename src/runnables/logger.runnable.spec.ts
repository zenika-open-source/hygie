import { Test, TestingModule } from '@nestjs/testing';
import { CallbackType } from './runnables.service';
import { logger } from '../logger/logger.service';
import { RuleResult } from '../rules/ruleResult';
import { LoggerRunnable } from './logger.runnable';
import { MockAnalytics, MockGithubService, MockGitlabService } from '../__mocks__/mocks';
import { EnvVarAccessor } from '../env-var/env-var.accessor';
import { Webhook } from '../webhook/webhook';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';

describe('LoggerRunnable', () => {
  let app: TestingModule;
  let loggerRunnable: LoggerRunnable;

  let githubService: GithubService;
  let gitlabService: GitlabService;

  let args: any;
  let ruleResultIssueTitle: RuleResult;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        LoggerRunnable,
        { provide: GithubService, useClass: MockGithubService },
        { provide: GitlabService, useClass: MockGitlabService },
        { provide: 'GoogleAnalytics', useValue: MockAnalytics },
        EnvVarAccessor,
      ],
    }).compile();

    logger.info = jest.fn().mockName('logger.info');
    logger.warn = jest.fn().mockName('logger.warn');
    logger.error = jest.fn().mockName('logger.error');

    githubService = app.get(GithubService);
    gitlabService = app.get(GitlabService);
    loggerRunnable = app.get(LoggerRunnable);

    const webhook = new Webhook(gitlabService, githubService);
    webhook.issue.title = 'test';
    webhook.issue.number = 22;

    args = { message: '{{data.issue.title}} is a correct issue title' };

    // ruleResultIssueTitle initialisation
    ruleResultIssueTitle = new RuleResult(webhook);
    ruleResultIssueTitle.validated = true;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('logger Runnable', () => {
    it('should call the info() method', () => {
      loggerRunnable
        .run(CallbackType.Both, ruleResultIssueTitle, args)
        .catch(err => logger.error(err));

      expect(logger.info).toBeCalledWith('test is a correct issue title');
      expect(logger.error).not.toBeCalled();
      expect(logger.warn).not.toBeCalled();
    });
  });

  describe('logger Runnable', () => {
    it('should call the error() method', () => {
      ruleResultIssueTitle.validated = false;
      args.type = undefined;
      loggerRunnable
        .run(CallbackType.Error, ruleResultIssueTitle, args)
        .catch(err => logger.error(err));

      expect(logger.info).not.toBeCalled();
      expect(logger.error).toBeCalledWith('test is a correct issue title');
      expect(logger.warn).not.toBeCalled();
    });
  });

  describe('logger Runnable', () => {
    it('should call the info() method', () => {
      ruleResultIssueTitle.validated = false;

      args.type = 'info';
      loggerRunnable
        .run(CallbackType.Both, ruleResultIssueTitle, args)
        .catch(err => logger.error(err));

      expect(logger.info).toBeCalledWith('test is a correct issue title');
      expect(logger.error).not.toBeCalled();
      expect(logger.warn).not.toBeCalled();
    });
  });

  describe('logger Runnable', () => {
    it('should call the warn() method', () => {
      ruleResultIssueTitle.validated = true;

      args.type = 'warn';
      loggerRunnable
        .run(CallbackType.Both, ruleResultIssueTitle, args)
        .catch(err => logger.error(err));

      expect(logger.info).not.toBeCalled();
      expect(logger.error).not.toBeCalled();
      expect(logger.warn).toBeCalled();
    });
  });
});
