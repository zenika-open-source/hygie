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
import { CheckCoverageRule, CoverageProvider } from './checkCoverage.rule';
import { GitTypeEnum } from '../webhook/utils.enum';
import { of } from 'rxjs';

describe('RulesService', () => {
  let app: TestingModule;
  let githubService: GithubService;
  let gitlabService: GitlabService;
  let httpService: HttpService;
  let webhook: Webhook;
  let previousRuleResults: RuleResult[];

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
    httpService = app.get(HttpService);
    webhook = new Webhook(gitlabService, githubService);
    // custom your webhook object

    previousRuleResults = [
      {
        gitApiInfos: {
          git: GitTypeEnum.Github,
          repositoryFullName: 'bastienterrier/test-webhook',
          projectId: '',
        },
        validated: false,
        data: {
          branch: 'master',
          commits: [
            {
              status: 'Failure',
              success: false,
              sha: '165da2e66929511e11c58bfe11204dbf452d4009',
              message: 'test',
              matches: null,
            },
          ],
        },
      },
    ];
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // CheckCoverage Rule
  describe('checkCoverage Rule', () => {
    it('should return true', async () => {
      httpService.get = jest.fn().mockImplementationOnce(() => {
        return of({
          data: {
            created_at: '2019-05-13T14:06:21Z',
            url: null,
            commit_message: 'v0.10.0',
            branch: 'master',
            committer_name: 'GitHub',
            committer_email: 'noreply@github.com',
            commit_sha: '7af70427d790d24f835f2a2754d4ad942ed21dcc',
            repo_name: 'DX-DeveloperExperience/git-webhooks',
            badge_url:
              'https://s3.amazonaws.com/assets.coveralls.io/badges/coveralls_78.svg',
            coverage_change: 0.2,
            covered_percent: 77.985285795133,
          },
        });
      });
      const checkCoverageRule = new CheckCoverageRule(httpService);
      checkCoverageRule.options = {
        allowDecrease: false,
        provider: CoverageProvider.Coveralls,
        threshold: 75,
      };
      jest.spyOn(checkCoverageRule, 'validate');

      const result: RuleResult = await checkCoverageRule.validate(
        webhook,
        checkCoverageRule,
        previousRuleResults,
      );
      const expectedResult = {
        coverage_change: 0.2,
        covered_percent: 77.985285795133,
      };

      expect(result.validated).toBe(true);
      expect(result.data).toEqual(expectedResult);
    });
  });

  describe('checkCoverage Rule', () => {
    it('should return false', async () => {
      httpService.get = jest.fn().mockImplementationOnce(() => {
        return of({
          data: {
            created_at: '2019-05-13T14:06:21Z',
            url: null,
            commit_message: 'v0.10.0',
            branch: 'master',
            committer_name: 'GitHub',
            committer_email: 'noreply@github.com',
            commit_sha: '7af70427d790d24f835f2a2754d4ad942ed21dcc',
            repo_name: 'DX-DeveloperExperience/git-webhooks',
            badge_url:
              'https://s3.amazonaws.com/assets.coveralls.io/badges/coveralls_78.svg',
            coverage_change: -0.2,
            covered_percent: 77.985285795133,
          },
        });
      });
      const checkCoverageRule = new CheckCoverageRule(httpService);
      checkCoverageRule.options = {
        allowDecrease: false,
        provider: CoverageProvider.Coveralls,
        threshold: 75,
      };
      jest.spyOn(checkCoverageRule, 'validate');

      const result: RuleResult = await checkCoverageRule.validate(
        webhook,
        checkCoverageRule,
        previousRuleResults,
      );
      const expectedResult = {
        coverage_change: -0.2,
        covered_percent: 77.985285795133,
      };

      expect(result.validated).toBe(false);
      expect(result.data).toEqual(expectedResult);
    });
  });

  describe('checkCoverage Rule', () => {
    it('should return false', async () => {
      httpService.get = jest.fn().mockImplementationOnce(() => {
        return of({
          data: {
            created_at: '2019-05-13T14:06:21Z',
            url: null,
            commit_message: 'v0.10.0',
            branch: 'master',
            committer_name: 'GitHub',
            committer_email: 'noreply@github.com',
            commit_sha: '7af70427d790d24f835f2a2754d4ad942ed21dcc',
            repo_name: 'DX-DeveloperExperience/git-webhooks',
            badge_url:
              'https://s3.amazonaws.com/assets.coveralls.io/badges/coveralls_78.svg',
            coverage_change: 0.2,
            covered_percent: 67.985285795133,
          },
        });
      });
      const checkCoverageRule = new CheckCoverageRule(httpService);
      checkCoverageRule.options = {
        allowDecrease: false,
        provider: CoverageProvider.Coveralls,
        threshold: 75,
      };
      jest.spyOn(checkCoverageRule, 'validate');

      const result: RuleResult = await checkCoverageRule.validate(
        webhook,
        checkCoverageRule,
        previousRuleResults,
      );
      const expectedResult = {
        coverage_change: 0.2,
        covered_percent: 67.985285795133,
      };

      expect(result.validated).toBe(false);
      expect(result.data).toEqual(expectedResult);
    });
  });
});
