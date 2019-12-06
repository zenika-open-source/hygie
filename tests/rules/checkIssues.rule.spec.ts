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
import { CheckIssuesRule } from '../../src/rules/checkIssues.rule';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';

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

      const checkIssuesRule = new CheckIssuesRule(MockAnalytics);
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

      const expectedResult = {};

      expect(result.validated).toBe(false);
      expect(result.data).toEqual(expectedResult);
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

      const checkIssuesRule = new CheckIssuesRule(MockAnalytics);
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

      const expectedResult = { issue: { number: [1, 2, 3] } };

      expect(result.validated).toBe(true);
      expect(result.data).toEqual(expectedResult);
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

      const checkIssuesRule = new CheckIssuesRule(MockAnalytics);
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

      const expectedResult = { issue: { number: [1, 2, 3] } };

      expect(result.validated).toBe(true);
      expect(result.data).toEqual(expectedResult);
    });
  });
});
