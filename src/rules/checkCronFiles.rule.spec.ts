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
import { CheckCronFilesRule } from './checkCronFiles.rule';

describe('RulesService', () => {
  let app: TestingModule;
  let githubService: GithubService;
  let gitlabService: GitlabService;
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
    webhook = new Webhook(gitlabService, githubService);
    webhook.commits = [
      {
        sha: 'sha',
        message: 'add some cron files',
        added: ['.hygie/cron-1.rulesrc'],
      },
    ];
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // CheckCronFiles Rule
  describe('checkCronFiles Rule', () => {
    it('should do something', async () => {
      // Implements your tests here
      const checkCronFilesRule = new CheckCronFilesRule(MockAnalytics);
      checkCronFilesRule.options = {
        users: {
          ignore: ['bastienterrier'],
        },
      };
      jest.spyOn(checkCronFilesRule, 'validate');

      const result: RuleResult = await checkCronFilesRule.validate(
        webhook,
        checkCronFilesRule,
      );
      const expectedResult = {
        cron: {
          added: ['.hygie/cron-1.rulesrc'],
          removed: [],
          updated: [],
        },
      };

      expect(result.validated).toBe(true);
      expect(result.data).toEqual(expectedResult);
    });
  });
});
