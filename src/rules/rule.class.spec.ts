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

jest.mock('../analytics/analytics.decorator');

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
