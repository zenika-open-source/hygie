import { logger } from '../../src/logger/logger.service';
import { PullRequestTitleRule } from '../../src/rules';
import { Webhook } from '../../src/webhook/webhook';
import { TestingModule, Test } from '@nestjs/testing';
import { GithubService } from '../../src/github/github.service';
import { GitlabService } from '../../src/gitlab/gitlab.service';
import { HttpService } from '@nestjs/common';
import {
  MockHttpService,
  MockGitlabService,
  MockGithubService,
  MockAnalytics,
} from '../../src/__mocks__/mocks';
import { GitEventEnum } from '../../src/webhook/utils.enum';
import { IssueTitleRule } from '../../src/rules/issueTitle.rule';

describe('Rule', () => {
  let app: TestingModule;
  let githubService: GithubService;
  let gitlabService: GitlabService;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        { provide: HttpService, useClass: MockHttpService },
        { provide: GitlabService, useClass: MockGitlabService },
        { provide: GithubService, useClass: MockGithubService },
      ],
    }).compile();

    githubService = app.get(GithubService);
    gitlabService = app.get(GitlabService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('displayRule', () => {
    it('should call logger.info 8 times', () => {
      logger.info = jest.fn().mockName('logger.info');
      const pullRequestTitle = new PullRequestTitleRule(MockAnalytics);
      pullRequestTitle.options = {
        regexp: '(WIP|FIX):\\s.*',
      };

      pullRequestTitle.displayRule();

      expect(logger.info).toHaveBeenNthCalledWith(1, 'Display rule');
      expect(logger.info).toHaveBeenNthCalledWith(2, 'name:pullRequestTitle');
      expect(logger.info).toHaveBeenNthCalledWith(3, 'enabled:true');
      expect(logger.info).toHaveBeenNthCalledWith(4, 'events:NewPR');
      expect(logger.info).toHaveBeenNthCalledWith(5, 'onSuccess:undefined');
      expect(logger.info).toHaveBeenNthCalledWith(6, 'onError:undefined');
      expect(logger.info).toHaveBeenNthCalledWith(7, 'onBoth:undefined');
      expect(logger.info).toHaveBeenNthCalledWith(8, 'options:[object Object]');
    });
  });

  describe('isEnabled', () => {
    it('should return true', () => {
      const webhook: Webhook = new Webhook(gitlabService, githubService);
      webhook.gitEvent = GitEventEnum.NewIssue;
      const issueTitleRule: IssueTitleRule = new IssueTitleRule(MockAnalytics);
      // By default, IssueTitleRule.events = NewIssue
      expect(issueTitleRule.isEnabled(webhook, issueTitleRule)).toBe(true);
    });
    it('should return false', () => {
      const webhook: Webhook = new Webhook(gitlabService, githubService);
      webhook.gitEvent = GitEventEnum.NewBranch;
      const issueTitleRule: IssueTitleRule = new IssueTitleRule(MockAnalytics);
      // By default, IssueTitleRule.events = NewIssue
      expect(issueTitleRule.isEnabled(webhook, issueTitleRule)).toBe(false);
    });
    it('should return false', () => {
      const webhook: Webhook = new Webhook(gitlabService, githubService);
      webhook.gitEvent = GitEventEnum.NewIssue;
      const issueTitleRule: IssueTitleRule = new IssueTitleRule(MockAnalytics);
      // By default, IssueTitleRule.events = NewIssue
      issueTitleRule.enabled = false;
      expect(issueTitleRule.isEnabled(webhook, issueTitleRule)).toBe(false);
    });
  });
});
