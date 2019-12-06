import { Test, TestingModule } from '@nestjs/testing';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { Webhook } from '../webhook/webhook';
import { RuleResult } from './ruleResult';
import { HttpService } from '@nestjs/common';
import {
  MockHttpService,
  MockGitlabService,
  MockGithubService,
  MockAnalytics,
} from '../__mocks__/mocks';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { CheckPullRequestsRule } from './checkPullRequests.rule';

describe('RulesService', () => {
  let app: TestingModule;
  let githubService: GithubService;
  let gitlabService: GitlabService;
  let webhook: Webhook;
  let httpService: HttpService;

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

  // CheckPullRequests Rule
  describe('CheckPullRequests Rule', () => {
    it('should return false + empty data', async () => {
      githubService.getPullRequests = jest
        .fn()
        .mockImplementationOnce((...args) => []); // no pull request
      httpService.get = jest.fn().mockImplementation((...args) => {
        return new Observable<AxiosResponse<any>>();
      });

      const checkPullRequestsRule = new CheckPullRequestsRule(MockAnalytics);
      checkPullRequestsRule.options = {
        notUpdatedSinceXDays: 7,
        state: 'open',
      };
      jest.spyOn(checkPullRequestsRule, 'validate');

      const result: RuleResult = await checkPullRequestsRule.validate(
        webhook,
        checkPullRequestsRule,
      );
      jest.fn().mockReset();

      expect(result.validated).toBe(false);
      expect(result.data.pullRequest.number).toEqual(undefined);
    });
  });
  describe('CheckPullRequests Rule', () => {
    it('should return true + array of pull request number', async () => {
      githubService.getPullRequests = jest
        .fn()
        .mockImplementationOnce((...args) => [
          {
            number: 1,
            updatedAt: '2019-03-25T05:50:47Z',
          },
          {
            number: 2,
            updatedAt: '2019-03-25T05:50:47Z',
          },
          {
            number: 3,
            updatedAt: '2019-03-25T05:50:47Z',
          },
        ]);
      httpService.get = jest.fn().mockImplementation((...args) => {
        return new Observable<AxiosResponse<any>>();
      });

      const checkPullRequestsRule = new CheckPullRequestsRule(MockAnalytics);
      checkPullRequestsRule.options = {
        notUpdatedSinceXDays: 0, // for testing
        state: 'close',
      };
      jest.spyOn(checkPullRequestsRule, 'validate');

      const result: RuleResult = await checkPullRequestsRule.validate(
        webhook,
        checkPullRequestsRule,
      );

      jest.fn().mockReset();

      expect(result.validated).toBe(true);
      expect(result.data.pullRequest.number).toEqual([1, 2, 3]);
    });
  });
  describe('CheckPullRequests Rule', () => {
    it('should return true + array of pull request number', async () => {
      githubService.getPullRequests = jest
        .fn()
        .mockImplementationOnce((...args) => [
          {
            number: 1,
            updatedAt: '2019-03-25T05:50:47Z',
          },
          {
            number: 2,
            updatedAt: '2019-03-25T05:50:47Z',
          },
          {
            number: 3,
            updatedAt: '2019-03-25T05:50:47Z',
          },
        ]);
      httpService.get = jest.fn().mockImplementation((...args) => {
        return new Observable<AxiosResponse<any>>();
      });

      const checkPullRequestsRule = new CheckPullRequestsRule(MockAnalytics);
      checkPullRequestsRule.options = {
        notUpdatedSinceXDays: 0, // for testing
        state: 'all',
      };
      jest.spyOn(checkPullRequestsRule, 'validate');

      const result: RuleResult = await checkPullRequestsRule.validate(
        webhook,
        checkPullRequestsRule,
      );

      jest.fn().mockReset();

      expect(result.validated).toBe(true);
      expect(result.data.pullRequest.number).toEqual([1, 2, 3]);
    });
  });
});
