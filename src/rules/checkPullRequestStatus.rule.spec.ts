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
import { PullRequestCommentRule } from './pullRequestComment.rule';
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
        status: 'ReopenedPR',
      };
      const result: RuleResult = await checkPullRequestStatus.validate(
        webhook,
        checkPullRequestStatus,
      );
      expect(result.validated).toBe(false);
      expect(result.data).toEqual({ PREvent: 'ClosedPR' });
    });
  });
  describe('checkPullRequestStatus Rule', () => {
    it('should return true', async () => {
      checkPullRequestStatus.options = {
        status: 'ClosedPR',
      };
      const result: RuleResult = await checkPullRequestStatus.validate(
        webhook,
        checkPullRequestStatus,
      );
      expect(result.validated).toBe(true);
      expect(result.data).toEqual({ PREvent: 'ClosedPR' });
    });
  });
});
