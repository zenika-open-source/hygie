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
import { IssueCommentRule } from '../../src/rules/issueComment.rule';

describe('RulesService', () => {
  let app: TestingModule;
  let githubService: GithubService;
  let gitlabService: GitlabService;

  // INIT
  const webhook = new Webhook(gitlabService, githubService);
  webhook.branchName = 'test_webhook';
  webhook.issue = {
    title: 'my issue for webhook',
    number: 22,
    description: 'issue description',
  };
  webhook.comment = {
    id: 123,
    description: 'comment on issue',
  };

  const issueComment = new IssueCommentRule(MockAnalytics);
  issueComment.options = {
    regexp: '^@ping$',
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
      const result: RuleResult = await issueComment.validate(
        webhook,
        issueComment,
      );
      expect(result.validated).toBe(false);
      expect(result.data).toEqual({
        comment: {
          description: 'comment on issue',
          id: 123,
          matches: null,
        },
        issue: {
          description: 'issue description',
          number: 22,
          title: 'my issue for webhook',
        },
      });
    });

    it('should return true', async () => {
      webhook.comment.description = '@ping';
      const result: RuleResult = await issueComment.validate(
        webhook,
        issueComment,
      );
      expect(result.validated).toBe(true);
      expect(JSON.parse(JSON.stringify(result.data))).toEqual({
        comment: {
          description: '@ping',
          id: 123,
          matches: ['@ping'],
        },
        issue: {
          description: 'issue description',
          number: 22,
          title: 'my issue for webhook',
        },
      });
    });
  });
});
