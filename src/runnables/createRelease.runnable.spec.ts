import { Test, TestingModule } from '@nestjs/testing';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { GitTypeEnum } from '../webhook/utils.enum';
import { CallbackType } from './runnables.service';
import { RuleResult } from '../rules/ruleResult';
import { GitApiInfos } from '../git/gitApiInfos';
import { MockGitlabService, MockGithubService } from '../__mocks__/mocks';
import { CreateReleaseRunnable } from './createRelease.runnable';

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
      createReleaseRunnable.run(CallbackType.Both, ruleResult, args);
      expect(githubService.createRelease).not.toBeCalled();
      expect(gitlabService.createRelease).not.toBeCalled();
    });
  });
  describe('Run method', () => {
    it('should call the createRelease Github service', () => {
      ruleResult.gitApiInfos.git = GitTypeEnum.Github;

      createReleaseRunnable.run(CallbackType.Both, ruleResult, args);
      expect(githubService.createRelease).toBeCalled();
      expect(gitlabService.createRelease).not.toBeCalled();
    });
  });
  describe('Run method', () => {
    it('should call the createRelease Gitlab service', () => {
      ruleResult.gitApiInfos.git = GitTypeEnum.Gitlab;

      createReleaseRunnable.run(CallbackType.Both, ruleResult, args);
      expect(githubService.createRelease).not.toBeCalled();
      expect(gitlabService.createRelease).toBeCalled();
    });
  });
});
