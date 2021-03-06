import { Test, TestingModule } from '@nestjs/testing';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { Webhook } from '../webhook/webhook';
import { RuleResult } from '../rules/ruleResult';
import { BranchNameRule } from './branchName.rule';
import { HttpService } from '@nestjs/common';
import {
  MockHttpService,
  MockGitlabService,
  MockGithubService,
} from '../__mocks__/mocks';

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

  // BrancheName Rule
  describe('branchName Rule', () => {
    it('should return true', async () => {
      const webhook = new Webhook(gitlabService, githubService);
      webhook.branchName = 'features/tdd';
      const branchName = new BranchNameRule();
      branchName.options = {
        regexp: '(features|fix)\\/.*',
      };
      jest.spyOn(branchName, 'validate');

      const result: RuleResult = await branchName.validate(webhook, branchName);
      expect(result.validated).toBe(true);
      expect((result.data as any).branchSplit).toEqual(['features', 'tdd']);
      expect(JSON.parse(JSON.stringify((result.data as any).matches))).toEqual([
        'features/tdd',
        'features',
      ]);
    });
  });
  describe('branchName Rule', () => {
    it('should return false', async () => {
      const webhook = new Webhook(gitlabService, githubService);
      webhook.branchName = 'testing/tdd';
      const branchName = new BranchNameRule();
      branchName.options = {
        regexp: '(features|fix)\\/.*',
      };
      jest.spyOn(branchName, 'validate');

      const result: RuleResult = await branchName.validate(webhook, branchName);
      expect(result.validated).toBe(false);
      expect((result.data as any).branchSplit).toEqual(['testing', 'tdd']);
      expect((result.data as any).matches).toEqual(null);
    });
  });
});
