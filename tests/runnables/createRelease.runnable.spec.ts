import { Test, TestingModule } from '@nestjs/testing';
import { GithubService } from '../../src/github/github.service';
import { GitlabService } from '../../src/gitlab/gitlab.service';
import { GitTypeEnum } from '../../src/webhook/utils.enum';
import { CallbackType } from '../../src/runnables/runnables.service';
import { RuleResult } from '../../src/rules/ruleResult';
import { GitApiInfos } from '../../src/git/gitApiInfos';
import {
  MockGitlabService,
  MockGithubService,
  MockAnalytics,
} from '../../src/__mocks__/mocks';
import { CreateReleaseRunnable } from '../../src/runnables/createRelease.runnable';
import { logger } from '../../src/logger/logger.service';
import { EnvVarAccessor } from '../../src/env-var/env-var.accessor';

describe('createRelease Runnable', () => {
  let app: TestingModule;

  let githubService: GithubService;
  let gitlabService: GitlabService;

  let createReleaseRunnable: CreateReleaseRunnable;

  let args: any;
  let ruleResult: RuleResult;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        CreateReleaseRunnable,
        { provide: GitlabService, useClass: MockGitlabService },
        { provide: GithubService, useClass: MockGithubService },
        { provide: 'GoogleAnalytics', useValue: MockAnalytics },
        EnvVarAccessor,
      ],
    }).compile();

    githubService = app.get(GithubService);
    gitlabService = app.get(GitlabService);
    createReleaseRunnable = app.get(CreateReleaseRunnable);

    const myGitApiInfos = new GitApiInfos();
    myGitApiInfos.repositoryFullName = 'bastienterrier/test_webhook';
    myGitApiInfos.git = GitTypeEnum.Undefined;

    args = { tag: 'v0.0.1' };

    ruleResult = new RuleResult(myGitApiInfos);
    ruleResult.validated = false;
    ruleResult.data = {
      some: 'data',
    };
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Run method', () => {
    it('should not call the createRelease Github nor Gitlab service', () => {
      createReleaseRunnable
        .run(CallbackType.Both, ruleResult, args)
        .catch(err => logger.error(err));
      expect(githubService.createRelease).not.toBeCalled();
      expect(gitlabService.createRelease).not.toBeCalled();
    });
  });
  describe('Run method', () => {
    it('should call the createRelease Github service', () => {
      ruleResult.gitApiInfos.git = GitTypeEnum.Github;

      createReleaseRunnable
        .run(CallbackType.Both, ruleResult, args)
        .catch(err => logger.error(err));
      expect(githubService.createRelease).toBeCalled();
      expect(gitlabService.createRelease).not.toBeCalled();
    });
  });
  describe('Run method', () => {
    it('should call the createRelease Gitlab service', () => {
      ruleResult.gitApiInfos.git = GitTypeEnum.Gitlab;

      createReleaseRunnable
        .run(CallbackType.Both, ruleResult, args)
        .catch(err => logger.error(err));
      expect(githubService.createRelease).not.toBeCalled();
      expect(gitlabService.createRelease).toBeCalled();
    });
  });
});
