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
import { OneCommitPerPRRule } from './oneCommitPerPR.rule';

jest.mock('../analytics/analytics.decorator');

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
      const oneCommitPerPR = new OneCommitPerPRRule();
      jest.spyOn(oneCommitPerPR, 'validate');

      const result: RuleResult = await oneCommitPerPR.validate(
        webhook,
        oneCommitPerPR,
      );
      expect(result.validated).toBe(false);
      expect(result.data.commits).toEqual(webhook.commits);
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
      const oneCommitPerPR = new OneCommitPerPRRule();
      jest.spyOn(oneCommitPerPR, 'validate');

      const result: RuleResult = await oneCommitPerPR.validate(
        webhook,
        oneCommitPerPR,
      );
      expect(result.validated).toBe(true);
      expect(result.data.commits).toEqual(webhook.commits);
    });
  });
});
