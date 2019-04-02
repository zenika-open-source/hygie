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
  };
  webhook.comment = {
    id: 123,
    description: 'comment on issue',
  };

  const issueComment = new IssueCommentRule();
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
    it('should return false', () => {
      const result: RuleResult = issueComment.validate(webhook, issueComment);
      expect(result.validated).toBe(false);
      expect(result.data).toEqual({
        issueTitle: webhook.issue.title,
        issueNumber: webhook.issue.number,
        commentId: webhook.comment.id,
        commentDescription: webhook.comment.description,
      });
    });

    it('should return true', () => {
      webhook.comment.description = '@ping';
      const result: RuleResult = issueComment.validate(webhook, issueComment);
      expect(result.validated).toBe(true);
      expect(result.data).toEqual({
        issueTitle: webhook.issue.title,
        issueNumber: webhook.issue.number,
        commentId: webhook.comment.id,
        commentDescription: webhook.comment.description,
      });
    });
  });
});