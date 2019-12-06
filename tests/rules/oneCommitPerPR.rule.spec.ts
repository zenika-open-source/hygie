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
import { OneCommitPerPRRule } from '../../src/rules/oneCommitPerPR.rule';

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

  // OneCommitPerPR Rule
  describe('oneCommitPerPR Rule', () => {
    it('should return false', async () => {
      const webhook = new Webhook(gitlabService, githubService);
      webhook.branchName = 'test_webhook';
      webhook.commits = [
        {
          message: 'fix: readme (#12)',
          sha: '1',
        },
        {
          message: 'feat(test): tdd (#34)',
          sha: '2',
        },
        {
          message: 'docs: gh-pages',
          sha: '3',
        },
      ];
      const oneCommitPerPR = new OneCommitPerPRRule(MockAnalytics);
      jest.spyOn(oneCommitPerPR, 'validate');

      const result: RuleResult = await oneCommitPerPR.validate(
        webhook,
        oneCommitPerPR,
      );
      expect(result.validated).toBe(false);
      expect((result.data as any).commits).toEqual(webhook.commits);
      expect((result.data as any).branch).toEqual(webhook.branchName);
    });
  });
  describe('oneCommitPerPR Rule', () => {
    it('should return true', async () => {
      const webhook = new Webhook(gitlabService, githubService);
      webhook.branchName = 'test_webhook';
      webhook.commits = [
        {
          message: 'fix: readme (#12)',
          sha: '1',
        },
      ];
      const oneCommitPerPR = new OneCommitPerPRRule(MockAnalytics);
      jest.spyOn(oneCommitPerPR, 'validate');

      const result: RuleResult = await oneCommitPerPR.validate(
        webhook,
        oneCommitPerPR,
      );
      expect(result.validated).toBe(true);
      expect((result.data as any).commits).toEqual(webhook.commits);
      expect((result.data as any).branch).toEqual(webhook.branchName);
    });
  });
});
