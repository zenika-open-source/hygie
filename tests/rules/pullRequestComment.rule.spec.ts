import { Test, TestingModule } from '@nestjs/testing';
import { GithubService } from '../../src/github/github.service';
import { GitlabService } from '../../src/gitlab/gitlab.service';
import { Webhook } from '../../src/webhook/webhook';
import { RuleResult } from '../../src/rules/ruleResult';
import { HttpService } from '@nestjs/common';
import {
  MockHttpService,
  MockGitlabService,
  MockGithubService,
  MockAnalytics,
} from '../../src/__mocks__/mocks';
import { PullRequestCommentRule } from '../../src/rules/pullRequestComment.rule';

describe('RulesService', () => {
  let app: TestingModule;
  let githubService: GithubService;
  let gitlabService: GitlabService;

  // INIT
  const webhook = new Webhook(gitlabService, githubService);
  webhook.branchName = 'test_webhook';
  webhook.pullRequest = {
    title: 'my PR for webhook',
    description: 'my desc',
    number: 22,
  };
  webhook.comment = {
    id: 123,
    description: 'comment on PR',
  };

  const pullRequestComment = new PullRequestCommentRule(MockAnalytics);
  pullRequestComment.options = {
    regexp: '^@pong$',
  };

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

  // PullRequestComment Rule
  describe('PullRequestComment Rule', () => {
    it('should return false', async () => {
      const result: RuleResult = await pullRequestComment.validate(
        webhook,
        pullRequestComment,
      );
      expect(result.validated).toBe(false);
      expect(result.data).toEqual({
        pullRequest: {
          title: webhook.pullRequest.title,
          number: webhook.pullRequest.number,
          description: webhook.pullRequest.description,
        },
        comment: {
          id: webhook.comment.id,
          description: webhook.comment.description,
          matches: null,
        },
      });
    });

    it('should return true', async () => {
      webhook.comment.description = '@pong';
      const result: RuleResult = await pullRequestComment.validate(
        webhook,
        pullRequestComment,
      );
      expect(result.validated).toBe(true);
      expect(JSON.parse(JSON.stringify(result.data))).toEqual({
        pullRequest: {
          title: webhook.pullRequest.title,
          number: webhook.pullRequest.number,
          description: webhook.pullRequest.description,
        },
        comment: {
          id: webhook.comment.id,
          description: webhook.comment.description,
          matches: ['@pong'],
        },
      });
    });
  });
});
