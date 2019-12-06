import { TestingModule, Test } from '@nestjs/testing';
import { RunnablesService } from '../../src/runnables/runnables.service';
import { RuleResult } from '../../src/rules/ruleResult';
import { GitApiInfos } from '../../src/git/gitApiInfos';
import { GitTypeEnum } from '../../src/webhook/utils.enum';
import { IssueTitleRule } from '../../src/rules';
import {
  MockRunnableModule,
  MockRunnable,
} from '../../src/__mocks__/mock.runnables.module';
import { MockAnalytics } from '../../src/__mocks__/mocks';

describe('Runnables Service', () => {
  let app: TestingModule;
  let runnablesService: RunnablesService;
  let myGitApiInfos: GitApiInfos;
  let ruleResultIssueTitle: RuleResult;
  let issueTitleRule: IssueTitleRule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [MockRunnableModule],
    }).compile();
    runnablesService = app.get(RunnablesService);

    myGitApiInfos = new GitApiInfos();
    myGitApiInfos.repositoryFullName = 'bastienterrier/test_webhook';
    myGitApiInfos.git = GitTypeEnum.Undefined;

    // ruleResultIssueTitle initialisation
    ruleResultIssueTitle = new RuleResult(myGitApiInfos);
    ruleResultIssueTitle.validated = false;
    ruleResultIssueTitle.data = {
      issue: { number: 22 },
    };

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
