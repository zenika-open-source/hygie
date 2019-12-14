import { Test, TestingModule } from '@nestjs/testing';
import { CallbackType } from './runnables.service';
import { RuleResult } from '../rules/ruleResult';
import { LoggerRunnable } from './logger.runnable';
import {
  MockAnalytics,
  MockGithubService,
  MockGitlabService,
} from '../__mocks__/mocks';
import { EnvVarAccessor } from '../env-var/env-var.accessor';
import { Webhook } from '../webhook/webhook';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { CommonModule } from '~common/common.module';
import { LoggerService } from '~common/providers/logger/logger.service';

describe('LoggerRunnable', () => {
  let app: TestingModule;
  let loggerRunnable: LoggerRunnable;

  let loggerService: LoggerService;

  let githubService: GithubService;
  let gitlabService: GitlabService;

  let args: any;
  let ruleResultIssueTitle: RuleResult;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [CommonModule],
      providers: [
        LoggerRunnable,
        { provide: GithubService, useClass: MockGithubService },
        { provide: GitlabService, useClass: MockGitlabService },
        { provide: 'GoogleAnalytics', useValue: MockAnalytics },
        EnvVarAccessor,
      ],
    }).compile();

    githubService = app.get(GithubService);
    gitlabService = app.get(GitlabService);
    loggerRunnable = app.get(LoggerRunnable);
    loggerService = app.get(LoggerService);

    loggerService.log = jest.fn().mockName('loggerService.log');
    loggerService.warn = jest.fn().mockName('loggerService.warn');
    loggerService.error = jest.fn().mockName('loggerService.error');

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
        .catch(err => loggerService.error(err, {}));

      expect(loggerService.log).toBeCalledWith(
        'test is a correct issue title',
        {},
      );
      expect(loggerService.error).not.toBeCalled();
      expect(loggerService.warn).not.toBeCalled();
    });
  });

  describe('logger Runnable', () => {
    it('should call the error() method', () => {
      ruleResultIssueTitle.validated = false;
      args.type = undefined;
      loggerRunnable
        .run(CallbackType.Error, ruleResultIssueTitle, args)
        .catch(err => loggerService.error(err, {}));

      expect(loggerService.log).not.toBeCalled();
      expect(loggerService.error).toBeCalledWith(
        'test is a correct issue title',
        {},
      );
      expect(loggerService.warn).not.toBeCalled();
    });
  });

  describe('logger Runnable', () => {
    it('should call the info() method', () => {
      ruleResultIssueTitle.validated = false;

      args.type = 'info';
      loggerRunnable
        .run(CallbackType.Both, ruleResultIssueTitle, args)
        .catch(err => loggerService.error(err, {}));

      expect(loggerService.log).toBeCalledWith(
        'test is a correct issue title',
        {},
      );
      expect(loggerService.error).not.toBeCalled();
      expect(loggerService.warn).not.toBeCalled();
    });
  });

  describe('logger Runnable', () => {
    it('should call the warn() method', () => {
      ruleResultIssueTitle.validated = true;

      args.type = 'warn';
      loggerRunnable
        .run(CallbackType.Both, ruleResultIssueTitle, args)
        .catch(err => loggerService.error(err, {}));

      expect(loggerService.log).not.toBeCalled();
      expect(loggerService.error).not.toBeCalled();
      expect(loggerService.warn).toBeCalled();
    });
  });
});
