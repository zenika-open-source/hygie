import { Test, TestingModule } from '@nestjs/testing';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { GitTypeEnum } from '../webhook/utils.enum';
import { CallbackType } from './runnables.service';
import { RuleResult } from '../rules/ruleResult';
import { GitApiInfos } from '../git/gitApiInfos';
import {
  MockGitlabService,
  MockGithubService,
  MockAnalytics,
} from '../__mocks__/mocks';
import { UpdateCronRunnable } from './updateCron.runnable';
import { logger } from '../logger/logger.service';

describe('UpdateCronRunnable', () => {
  let app: TestingModule;

  let githubService: GithubService;
  let gitlabService: GitlabService;

  let updateCronRunnable: UpdateCronRunnable;

  let args: any;
  let ruleResult: RuleResult;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        UpdateCronRunnable,
        { provide: GitlabService, useClass: MockGitlabService },
        { provide: GithubService, useClass: MockGithubService },
        { provide: 'GoogleAnalytics', useValue: MockAnalytics },
      ],
    }).compile();

    githubService = app.get(GithubService);
    gitlabService = app.get(GitlabService);
    updateCronRunnable = app.get(UpdateCronRunnable);

    const myGitApiInfos = new GitApiInfos();
    myGitApiInfos.repositoryFullName = 'bastienterrier/test_webhook';
    myGitApiInfos.git = GitTypeEnum.Undefined;

    args = { some: 'arg' };

    ruleResult = new RuleResult(myGitApiInfos);
    ruleResult.validated = false;
    ruleResult.data = {
      cron: {
        added: [],
        updated: ['cron-1.rulesrc'],
        removed: ['cron-2.rulesrc'],
      },
    };
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Run method', () => {
    it('should do something', () => {
      updateCronRunnable
        .run(CallbackType.Both, ruleResult, args)
        .catch(err => logger.error(err));
    });
  });
});
