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
import { IssueCommentRule } from './issueComment.rule';

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
    });

    it('should return true', async () => {
      webhook.comment.description = '@ping';
      const result: RuleResult = await issueComment.validate(
        webhook,
        issueComment,
      );
      expect(result.validated).toBe(true);
      expect(JSON.stringify(result.data.comment.matches)).toEqual(
        JSON.stringify(['@ping']),
      );
    });
  });
});
