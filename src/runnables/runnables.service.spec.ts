import { TestingModule, Test } from '@nestjs/testing';
import { RunnablesService } from './runnables.service';
import { RuleResult } from '../rules/ruleResult';
import { IssueTitleRule } from '../rules';
import {
  MockRunnableModule,
  MockRunnable,
} from '../__mocks__/mock.runnables.module';
import {
  MockAnalytics,
  MockGitlabService,
  MockGithubService,
} from '../__mocks__/mocks';
import { Webhook } from '../webhook/webhook';
import { GitlabService } from '../gitlab/gitlab.service';
import { GithubService } from '../github/github.service';

describe('Runnables Service', () => {
  let app: TestingModule;
  let runnablesService: RunnablesService;
  let ruleResultIssueTitle: RuleResult;
  let issueTitleRule: IssueTitleRule;

  let githubService: GithubService;
  let gitlabService: GitlabService;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        { provide: GitlabService, useClass: MockGitlabService },
        { provide: GithubService, useClass: MockGithubService },
      ],
      imports: [MockRunnableModule],
    }).compile();

    githubService = app.get(GithubService);
    gitlabService = app.get(GitlabService);
    runnablesService = app.get(RunnablesService);

    const webhook = new Webhook(gitlabService, githubService);
    webhook.issue.number = 22;

    // ruleResultIssueTitle initialisation
    ruleResultIssueTitle = new RuleResult(webhook);
    ruleResultIssueTitle.validated = false;

    issueTitleRule = new IssueTitleRule(MockAnalytics);
    issueTitleRule.onBoth = [
      {
        callback: 'MockRunnable',
        args: {
          arg: 'value',
        },
      },
    ];
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getRunnable', () => {
    it('should return MockRunnable instance', () => {
      const mockRunnable = runnablesService.getRunnable('MockRunnable');

      expect(mockRunnable instanceof MockRunnable).toBe(true);
    });
  });

  describe('executeRunnableFunctions', () => {
    it('should call the MockRunnable.run() method and return false', async () => {
      const mockRunnable = runnablesService.getRunnable('MockRunnable');

      const spy = jest.spyOn(mockRunnable, 'run');

      const result = await runnablesService.executeRunnableFunctions(
        ruleResultIssueTitle,
        issueTitleRule,
      );

      expect(spy).toBeCalled();
      expect(result).toBe(false);
    });
    describe('executeRunnableFunctions', () => {
      it('should call the MockRunnable.run() twice method and return false', async () => {
        issueTitleRule.onError = [
          {
            callback: 'MockRunnable',
            args: {
              arg: 'value',
            },
          },
        ];
        const mockRunnable = runnablesService.getRunnable('MockRunnable');

        const spy = jest.spyOn(mockRunnable, 'run');

        const result = await runnablesService.executeRunnableFunctions(
          ruleResultIssueTitle,
          issueTitleRule,
        );

        expect(spy).toBeCalledTimes(2);
        expect(result).toBe(false);
      });
    });
    describe('executeRunnableFunctions', () => {
      it('should call the MockRunnable.run() twice method and return true', async () => {
        ruleResultIssueTitle.validated = true;
        issueTitleRule.onError = [];
        issueTitleRule.onSuccess = [
          {
            callback: 'MockRunnable',
            args: {
              arg: 'value',
            },
          },
        ];
        const mockRunnable = runnablesService.getRunnable('MockRunnable');

        const spy = jest.spyOn(mockRunnable, 'run');

        const result = await runnablesService.executeRunnableFunctions(
          ruleResultIssueTitle,
          issueTitleRule,
        );

        expect(spy).toBeCalledTimes(2);
        expect(result).toBe(true);
      });
    });
  });
});
