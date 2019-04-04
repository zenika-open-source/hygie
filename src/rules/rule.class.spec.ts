import { logger } from '../logger/logger.service';
import { PullRequestTitleRule } from '.';
import { Webhook } from '../webhook/webhook';
import { TestingModule, Test } from '@nestjs/testing';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { HttpService } from '@nestjs/common';
import {
  MockHttpService,
  MockGitlabService,
  MockGithubService,
} from '../__mocks__/mocks';
import { GitEventEnum } from '../webhook/utils.enum';
import { IssueTitleRule } from './issueTitle.rule';

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
      const pullRequestTitle = new PullRequestTitleRule();
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
      const issueTitleRule: IssueTitleRule = new IssueTitleRule();
      // By default, IssueTitleRule.events = NewIssue
      expect(issueTitleRule.isEnabled(webhook, issueTitleRule)).toBe(true);
    });
    it('should return false', () => {
      const webhook: Webhook = new Webhook(gitlabService, githubService);
      webhook.gitEvent = GitEventEnum.NewBranch;
      const issueTitleRule: IssueTitleRule = new IssueTitleRule();
      // By default, IssueTitleRule.events = NewIssue
      expect(issueTitleRule.isEnabled(webhook, issueTitleRule)).toBe(false);
    });
    it('should return false', () => {
      const webhook: Webhook = new Webhook(gitlabService, githubService);
      webhook.gitEvent = GitEventEnum.NewIssue;
      const issueTitleRule: IssueTitleRule = new IssueTitleRule();
      // By default, IssueTitleRule.events = NewIssue
      issueTitleRule.enabled = false;
      expect(issueTitleRule.isEnabled(webhook, issueTitleRule)).toBe(false);
    });
  });
});
