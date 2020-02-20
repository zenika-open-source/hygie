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
} from '../__mocks__/mocks';
import { CheckIssuesRule } from './checkIssues.rule';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';

jest.mock('../analytics/analytics.decorator');

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

  // CheckIssues Rule
  describe('checkIssues Rule', () => {
    it('should return false + empty data', async () => {
      githubService.getIssues = jest
        .fn()
        .mockImplementationOnce((...args) => []); // no issue
      httpService.get = jest.fn().mockImplementation((...args) => {
        return new Observable<AxiosResponse<any>>();
      });

      const checkIssuesRule = new CheckIssuesRule();
      checkIssuesRule.options = {
        notUpdatedSinceXDays: 7,
        state: 'open',
      };
      jest.spyOn(checkIssuesRule, 'validate');

      const result: RuleResult = await checkIssuesRule.validate(
        webhook,
        checkIssuesRule,
      );
      jest.fn().mockReset();

      expect(result.validated).toBe(false);
      expect(result.data.issue.number).toEqual(undefined);
    });
  });
  describe('checkIssues Rule', () => {
    it('should return true + array of issue number', async () => {
      githubService.getIssues = jest.fn().mockImplementationOnce((...args) => [
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

      const checkIssuesRule = new CheckIssuesRule();
      checkIssuesRule.options = {
        notUpdatedSinceXDays: 0, // for testing
        state: 'close',
      };
      jest.spyOn(checkIssuesRule, 'validate');

      const result: RuleResult = await checkIssuesRule.validate(
        webhook,
        checkIssuesRule,
      );

      jest.fn().mockReset();

      expect(result.validated).toBe(true);
      expect(result.data.issue.number).toEqual([1, 2, 3]);
    });
  });
  describe('checkIssues Rule', () => {
    it('should return true + array of issue number', async () => {
      githubService.getIssues = jest.fn().mockImplementationOnce((...args) => [
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

      const checkIssuesRule = new CheckIssuesRule();
      checkIssuesRule.options = {
        notUpdatedSinceXDays: 0, // for testing
        state: 'all',
      };
      jest.spyOn(checkIssuesRule, 'validate');

      const result: RuleResult = await checkIssuesRule.validate(
        webhook,
        checkIssuesRule,
      );

      jest.fn().mockReset();

      expect(result.validated).toBe(true);
      expect(result.data.issue.number).toEqual([1, 2, 3]);
    });
  });
});
