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
import { CheckCoverageRule, CoverageProvider } from './checkCoverage.rule';
import { of } from 'rxjs';
describe('RulesService', () => {
  let app: TestingModule;
  let githubService: GithubService;
  let gitlabService: GitlabService;
  let httpService: HttpService;
  let webhook: Webhook;

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
    webhook.gitService = githubService;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // CheckCoverage Rule
  describe('checkCoverage Rule', () => {
    it('should return true', async () => {
      httpService.get = jest
        .fn()
        .mockImplementationOnce(() => {
          return of({
            data: {
              created_at: '2019-05-13T14:06:21Z',
              url: null,
              commit_message: 'v0.10.0',
              branch: 'develop',
              committer_name: 'GitHub',
              committer_email: 'noreply@github.com',
              commit_sha: 'c93f1779441198daef276a50a274d16a5a83dd4e',
              repo_name: 'DX-DeveloperExperience/hygie',
              badge_url:
                'https://s3.amazonaws.com/assets.coveralls.io/badges/coveralls_78.svg',
              coverage_change: -0.2,
              covered_percent: 77.985285795133,
            },
          });
        })
        .mockImplementationOnce(() => {
          return of({
            data: {
              created_at: '2019-05-13T14:06:21Z',
              url: null,
              commit_message: 'v0.10.0',
              branch: 'master',
              committer_name: 'GitHub',
              committer_email: 'noreply@github.com',
              commit_sha: '9d968cc538b9796ec61e78f4055814028e816858',
              repo_name: 'DX-DeveloperExperience/hygie',
              badge_url:
                'https://s3.amazonaws.com/assets.coveralls.io/badges/coveralls_78.svg',
              coverage_change: 0.2,
              covered_percent: 79.985285795133,
            },
          });
        });
      githubService.getLastBranchesCommitSha = jest
        .fn()
        .mockImplementationOnce((...args) => {
          return [
            {
              commitSha: 'c93f1779441198daef276a50a274d16a5a83dd4e',
              branch: 'develop',
            },
            {
              commitSha: '9d968cc538b9796ec61e78f4055814028e816858',
              branch: 'master',
            },
          ];
        });

      const checkCoverageRule = new CheckCoverageRule(
        httpService,
        MockAnalytics,
      );
      checkCoverageRule.options = {
        allowDecrease: true,
        provider: CoverageProvider.Coveralls,
        threshold: 75,
      };
      jest.spyOn(checkCoverageRule, 'validate');

      const result: RuleResult = await checkCoverageRule.validate(
        webhook,
        checkCoverageRule,
      );
      const expectedResult = {
        coverage: [
          {
            branch: 'develop',
            coverage_change: -0.2,
            covered_percent: 77.985285795133,
          },
          {
            branch: 'master',
            coverage_change: 0.2,
            covered_percent: 79.985285795133,
          },
        ],
      };

      expect(result.validated).toBe(true);
      expect(result.data).toEqual(expectedResult);
    });
  });

  describe('checkCoverage Rule', () => {
    it('should return false', async () => {
      httpService.get = jest
        .fn()
        .mockImplementationOnce(() => {
          return of({
            data: {
              created_at: '2019-05-13T14:06:21Z',
              url: null,
              commit_message: 'v0.10.0',
              branch: 'develop',
              committer_name: 'GitHub',
              committer_email: 'noreply@github.com',
              commit_sha: 'c93f1779441198daef276a50a274d16a5a83dd4e',
              repo_name: 'DX-DeveloperExperience/hygie',
              badge_url:
                'https://s3.amazonaws.com/assets.coveralls.io/badges/coveralls_78.svg',
              coverage_change: -0.2,
              covered_percent: 77.985285795133,
            },
          });
        })
        .mockImplementationOnce(() => {
          return of({
            data: {
              created_at: '2019-05-13T14:06:21Z',
              url: null,
              commit_message: 'v0.10.0',
              branch: 'master',
              committer_name: 'GitHub',
              committer_email: 'noreply@github.com',
              commit_sha: '9d968cc538b9796ec61e78f4055814028e816858',
              repo_name: 'DX-DeveloperExperience/hygie',
              badge_url:
                'https://s3.amazonaws.com/assets.coveralls.io/badges/coveralls_78.svg',
              coverage_change: 0.2,
              covered_percent: 79.985285795133,
            },
          });
        });
      githubService.getLastBranchesCommitSha = jest
        .fn()
        .mockImplementationOnce((...args) => {
          return [
            {
              commitSha: 'c93f1779441198daef276a50a274d16a5a83dd4e',
              branch: 'develop',
            },
            {
              commitSha: '9d968cc538b9796ec61e78f4055814028e816858',
              branch: 'master',
            },
          ];
        });
      const checkCoverageRule = new CheckCoverageRule(
        httpService,
        MockAnalytics,
      );
      checkCoverageRule.options = {
        allowDecrease: false,
        provider: CoverageProvider.Coveralls,
        threshold: 75,
      };
      jest.spyOn(checkCoverageRule, 'validate');

      const result: RuleResult = await checkCoverageRule.validate(
        webhook,
        checkCoverageRule,
      );
      const expectedResult = {
        coverage: [
          {
            branch: 'develop',
            coverage_change: -0.2,
            covered_percent: 77.985285795133,
          },
          {
            branch: 'master',
            coverage_change: 0.2,
            covered_percent: 79.985285795133,
          },
        ],
      };

      expect(result.validated).toBe(false);
      expect(result.data).toEqual(expectedResult);
    });
  });

  describe('checkCoverage Rule', () => {
    it('should return false', async () => {
      httpService.get = jest
        .fn()
        .mockImplementationOnce(() => {
          return of({
            data: {
              created_at: '2019-05-13T14:06:21Z',
              url: null,
              commit_message: 'v0.10.0',
              branch: 'develop',
              committer_name: 'GitHub',
              committer_email: 'noreply@github.com',
              commit_sha: 'c93f1779441198daef276a50a274d16a5a83dd4e',
              repo_name: 'DX-DeveloperExperience/hygie',
              badge_url:
                'https://s3.amazonaws.com/assets.coveralls.io/badges/coveralls_78.svg',
              coverage_change: 0.2,
              covered_percent: 67.985285795133,
            },
          });
        })
        .mockImplementationOnce(() => {
          return of({
            data: {
              created_at: '2019-05-13T14:06:21Z',
              url: null,
              commit_message: 'v0.10.0',
              branch: 'master',
              committer_name: 'GitHub',
              committer_email: 'noreply@github.com',
              commit_sha: '9d968cc538b9796ec61e78f4055814028e816858',
              repo_name: 'DX-DeveloperExperience/hygie',
              badge_url:
                'https://s3.amazonaws.com/assets.coveralls.io/badges/coveralls_78.svg',
              coverage_change: 0.2,
              covered_percent: 79.985285795133,
            },
          });
        });
      githubService.getLastBranchesCommitSha = jest
        .fn()
        .mockImplementationOnce((...args) => {
          return [
            {
              commitSha: 'c93f1779441198daef276a50a274d16a5a83dd4e',
              branch: 'develop',
            },
            {
              commitSha: '9d968cc538b9796ec61e78f4055814028e816858',
              branch: 'master',
            },
          ];
        });
      const checkCoverageRule = new CheckCoverageRule(
        httpService,
        MockAnalytics,
      );
      checkCoverageRule.options = {
        allowDecrease: false,
        provider: CoverageProvider.Coveralls,
        threshold: 75,
      };
      jest.spyOn(checkCoverageRule, 'validate');

      const result: RuleResult = await checkCoverageRule.validate(
        webhook,
        checkCoverageRule,
      );
      const expectedResult = {
        coverage: [
          {
            branch: 'develop',
            coverage_change: 0.2,
            covered_percent: 67.985285795133,
          },
          {
            branch: 'master',
            coverage_change: 0.2,
            covered_percent: 79.985285795133,
          },
        ],
      };

      expect(result.validated).toBe(false);
      expect(result.data).toEqual(expectedResult);
    });
  });
});
