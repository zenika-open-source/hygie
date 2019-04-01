import { Test, TestingModule } from '@nestjs/testing';
import { RunnablesService } from './runnables.service';
import {
  MockGitlabService,
  MockGithubService,
  MockHttpService,
} from '../__mocks__/mocks';
import { GitlabService } from '../gitlab/gitlab.service';
import { GithubService } from '../github/github.service';
import { logger } from '../logger/logger.service';
import { HttpService } from '@nestjs/common';
import { IssueTitleRule } from '../rules';
import { RuleResult } from '../rules/ruleResult';
import { GitApiInfos } from '../git/gitApiInfos';
import { GitTypeEnum } from '../webhook/utils.enum';

describe('RunnableService', () => {
  let app: TestingModule;
  let runnableService: RunnablesService;

  let issueTitleRule: IssueTitleRule;
  let ruleResultIssueTitle: RuleResult;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        RunnablesService,
        { provide: HttpService, useClass: MockHttpService },
        { provide: GitlabService, useClass: MockGitlabService },
        { provide: GithubService, useClass: MockGithubService },
      ],
    }).compile();

    logger.info = jest.fn().mockName('logger.info');
    logger.warn = jest.fn().mockName('logger.warn');
    logger.error = jest.fn().mockName('logger.error');

    runnableService = app.get(RunnablesService);

    const myGitApiInfos = new GitApiInfos();
    myGitApiInfos.repositoryFullName = 'bastienterrier/test_webhook';
    myGitApiInfos.git = GitTypeEnum.Undefined;

    // issueTitleRule initialisation
    issueTitleRule = new IssueTitleRule();
    issueTitleRule.onSuccess = [
      {
        callback: 'LoggerRunnable',
        args: { message: '{{data.issueTitle}} is a correct issue title' },
      },
    ];
    issueTitleRule.onError = [
      {
        callback: 'LoggerRunnable',
        args: { message: '{{data.issueTitle}} is a not correct issue title !' },
      },
    ];
    // ruleResultIssueTitle initialisation
    ruleResultIssueTitle = new RuleResult(myGitApiInfos);
    ruleResultIssueTitle.validated = true;
    ruleResultIssueTitle.data = {
      issueNumber: 22,
    };
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('logger Runnable', () => {
    it('should call the info() method', () => {
      runnableService.executeRunnableFunctions(
        ruleResultIssueTitle,
        issueTitleRule,
      );

      expect(logger.info).toBeCalled();
      expect(logger.error).not.toBeCalled();
      expect(logger.warn).not.toBeCalled();
    });
  });

  describe('logger Runnable', () => {
    it('should call the warn() method', () => {
      ruleResultIssueTitle.validated = false;

      runnableService.executeRunnableFunctions(
        ruleResultIssueTitle,
        issueTitleRule,
      );

      expect(logger.info).not.toBeCalled();
      expect(logger.error).toBeCalled();
      expect(logger.warn).not.toBeCalled();
    });
  });

  describe('logger Runnable', () => {
    it('should call the info() method', () => {
      ruleResultIssueTitle.validated = false;

      (issueTitleRule.onError as any)[0].args.type = 'info';

      runnableService.executeRunnableFunctions(
        ruleResultIssueTitle,
        issueTitleRule,
      );

      expect(logger.info).toBeCalled();
      expect(logger.error).not.toBeCalled();
      expect(logger.warn).not.toBeCalled();
    });
  });

  describe('logger Runnable', () => {
    it('should call the warn() method', () => {
      ruleResultIssueTitle.validated = true;

      (issueTitleRule.onSuccess as any)[0].args.type = 'warn';

      runnableService.executeRunnableFunctions(
        ruleResultIssueTitle,
        issueTitleRule,
      );

      expect(logger.info).not.toBeCalled();
      expect(logger.error).not.toBeCalled();
      expect(logger.warn).toBeCalled();
    });
  });
});
