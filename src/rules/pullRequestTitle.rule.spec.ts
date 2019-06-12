import { Test, TestingModule } from '@nestjs/testing';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { Webhook } from '../webhook/webhook';
import { RuleResult } from '../rules/ruleResult';
import { HttpService } from '@nestjs/common';
import {
  MockHttpService,
  MockGitlabService,
  MockGithubService,
  MockAnalytics,
} from '../__mocks__/mocks';
import { PullRequestTitleRule } from './pullRequestTitle.rule';

describe('RulesService', () => {
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

  // PullRequestTitle Rule
  describe('pullRequestTitle Rule', () => {
    it('should return false', async () => {
      const webhook = new Webhook(gitlabService, githubService);
      webhook.branchName = 'test_webhook';
      webhook.pullRequest = {
        title: 'my PR for webhook',
        description: 'my desc',
        number: 22,
      };

      const pullRequestTitle = new PullRequestTitleRule(MockAnalytics);
      pullRequestTitle.options = {
        regexp: '(WIP|FIX):\\s.*',
      };
      jest.spyOn(pullRequestTitle, 'validate');

      const result: RuleResult = await pullRequestTitle.validate(
        webhook,
        pullRequestTitle,
      );
      expect(result.validated).toBe(false);
      expect(result.data).toEqual({
        pullRequestTitle: webhook.pullRequest.title,
        pullRequestNumber: webhook.pullRequest.number,
        pullRequestDescription: webhook.pullRequest.description,
        matches: null,
      });
    });
  });
  describe('pullRequestTitle Rule', () => {
    it('should return true', async () => {
      const webhook = new Webhook(gitlabService, githubService);
      webhook.branchName = 'test_webhook';
      webhook.pullRequest = {
        title: 'WIP: webhook',
        description: 'my desc',
        number: 22,
      };

      const pullRequestTitle = new PullRequestTitleRule(MockAnalytics);
      pullRequestTitle.options = {
        regexp: '(WIP|FIX):\\s.*',
      };
      jest.spyOn(pullRequestTitle, 'validate');

      const result: RuleResult = await pullRequestTitle.validate(
        webhook,
        pullRequestTitle,
      );
      expect(result.validated).toBe(true);
      expect(JSON.parse(JSON.stringify(result.data))).toEqual({
        pullRequestTitle: webhook.pullRequest.title,
        pullRequestNumber: webhook.pullRequest.number,
        pullRequestDescription: webhook.pullRequest.description,
        matches: ['WIP: webhook', 'WIP'],
      });
    });
  });
});
