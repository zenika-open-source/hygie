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
} from '../__mocks__/mocks';
import { CheckPullRequestStatusRule } from './checkPullRequestStatus.rule';
import { GitEventEnum } from '../webhook/utils.enum';

describe('RulesService', () => {
  let app: TestingModule;
  let githubService: GithubService;
  let gitlabService: GitlabService;

  // INIT
  const webhook = new Webhook(gitlabService, githubService);
  webhook.branchName = 'test_webhook';
  webhook.gitEvent = GitEventEnum.ClosedPR;
  webhook.pullRequest = {
    title: 'my PR for webhook',
    description: 'my desc',
    number: 22,
  };

  const checkPullRequestStatus = new CheckPullRequestStatusRule();

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

  describe('checkPullRequestStatus Rule', () => {
    it('should return false', async () => {
      checkPullRequestStatus.options = {
        status: 'reopened',
      };
      const result: RuleResult = await checkPullRequestStatus.validate(
        webhook,
        checkPullRequestStatus,
      );
      expect(result.validated).toBe(false);
      expect(result.data).toEqual({
        pullRequestDescription: 'my desc',
        pullRequestEvent: 'closed',
        pullRequestNumber: 22,
        pullRequestTitle: 'my PR for webhook',
      });
    });
  });
  describe('checkPullRequestStatus Rule', () => {
    it('should return true', async () => {
      checkPullRequestStatus.options = {
        status: 'closed',
      };
      const result: RuleResult = await checkPullRequestStatus.validate(
        webhook,
        checkPullRequestStatus,
      );
      expect(result.validated).toBe(true);
      expect(result.data).toEqual({
        pullRequestDescription: 'my desc',
        pullRequestEvent: 'closed',
        pullRequestNumber: 22,
        pullRequestTitle: 'my PR for webhook',
      });
    });
  });

  describe('checkPullRequestStatus getEvent', () => {
    it('should return "new"', () => {
      webhook.gitEvent = GitEventEnum.NewPR;
      expect(checkPullRequestStatus.getEvent(webhook.gitEvent)).toBe('new');
    });
    it('should return "reopened"', () => {
      webhook.gitEvent = GitEventEnum.ReopenedPR;
      expect(checkPullRequestStatus.getEvent(webhook.gitEvent)).toBe(
        'reopened',
      );
    });
    it('should return "merged"', () => {
      webhook.gitEvent = GitEventEnum.MergedPR;
      expect(checkPullRequestStatus.getEvent(webhook.gitEvent)).toBe('merged');
    });
    it('should return "closed"', () => {
      webhook.gitEvent = GitEventEnum.ClosedPR;
      expect(checkPullRequestStatus.getEvent(webhook.gitEvent)).toBe('closed');
    });
  });
});
