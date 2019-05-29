import { Test, TestingModule } from '@nestjs/testing';
import { CallbackType } from './runnables.service';
import { logger } from '../logger/logger.service';
import { RuleResult } from '../rules/ruleResult';
import { GitApiInfos } from '../git/gitApiInfos';
import { GitTypeEnum } from '../webhook/utils.enum';
import { LoggerRunnable } from './logger.runnable';

describe('LoggerRunnable', () => {
  let app: TestingModule;
  let loggerRunnable: LoggerRunnable;

  let args: any;
  let ruleResultIssueTitle: RuleResult;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [LoggerRunnable],
    }).compile();

    logger.info = jest.fn().mockName('logger.info');
    logger.warn = jest.fn().mockName('logger.warn');
    logger.error = jest.fn().mockName('logger.error');

    loggerRunnable = app.get(LoggerRunnable);

    const myGitApiInfos = new GitApiInfos();
    myGitApiInfos.repositoryFullName = 'bastienterrier/test_webhook';
    myGitApiInfos.git = GitTypeEnum.Undefined;

    args = { message: '{{data.issueTitle}} is a correct issue title' };

    // ruleResultIssueTitle initialisation
    ruleResultIssueTitle = new RuleResult(myGitApiInfos);
    ruleResultIssueTitle.validated = true;
    ruleResultIssueTitle.data = {
      issueNumber: 22,
      issueTitle: 'test',
    };
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('logger Runnable', () => {
    it('should call the info() method', () => {
      loggerRunnable.run(CallbackType.Both, ruleResultIssueTitle, args);

      expect(logger.info).toBeCalled();
      expect(logger.error).not.toBeCalled();
      expect(logger.warn).not.toBeCalled();
    });
  });

  describe('logger Runnable', () => {
    it('should call the error() method', () => {
      ruleResultIssueTitle.validated = false;
      args.type = undefined;
      loggerRunnable.run(CallbackType.Error, ruleResultIssueTitle, args);

      expect(logger.info).not.toBeCalled();
      expect(logger.error).toBeCalled();
      expect(logger.warn).not.toBeCalled();
    });
  });

  describe('logger Runnable', () => {
    it('should call the info() method', () => {
      ruleResultIssueTitle.validated = false;

      args.type = 'info';
      loggerRunnable.run(CallbackType.Both, ruleResultIssueTitle, args);

      expect(logger.info).toBeCalled();
      expect(logger.error).not.toBeCalled();
      expect(logger.warn).not.toBeCalled();
    });
  });

  describe('logger Runnable', () => {
    it('should call the warn() method', () => {
      ruleResultIssueTitle.validated = true;

      args.type = 'warn';
      loggerRunnable.run(CallbackType.Both, ruleResultIssueTitle, args);

      expect(logger.info).not.toBeCalled();
      expect(logger.error).not.toBeCalled();
      expect(logger.warn).toBeCalled();
    });
  });
});
