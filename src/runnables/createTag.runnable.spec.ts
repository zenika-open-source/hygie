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
import { CreateTagRunnable } from './createTag.runnable';
import { EnvVarAccessor } from '../env-var/env-var.accessor';

describe('CreateTagRunnable', () => {
  let app: TestingModule;

  let githubService: GithubService;
  let gitlabService: GitlabService;

  let createTagRunnable: CreateTagRunnable;
  let myGitApiInfos: GitApiInfos;

  let args: any;
  let ruleResult: RuleResult;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        CreateTagRunnable,
        { provide: GitlabService, useClass: MockGitlabService },
        { provide: GithubService, useClass: MockGithubService },
        { provide: 'GoogleAnalytics', useValue: MockAnalytics },
        EnvVarAccessor,
      ],
    }).compile();

    githubService = app.get(GithubService);
    gitlabService = app.get(GitlabService);
    createTagRunnable = app.get(CreateTagRunnable);

    myGitApiInfos = new GitApiInfos();
    myGitApiInfos.repositoryFullName = 'bastienterrier/test_webhook';
    myGitApiInfos.git = GitTypeEnum.Undefined;

    args = { tag: '{{data.commits.0.matches.1}}' };

    ruleResult = new RuleResult(myGitApiInfos);
    ruleResult.validated = false;
    ruleResult.data = {
      branch: 'test_webhook',
      commits: [
        {
          status: 'Success',
          success: true,
          sha: '1',
          message: 'fix(): #v0.0.1#',
          matches: ['fix(): #v0.0.1#', 'v0.0.1'],
        },
      ],
    };
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Run method', () => {
    it('should not do anything', async () => {
      await createTagRunnable.run(CallbackType.Both, ruleResult, args);
      expect(githubService.createTag).not.toBeCalled();
      expect(gitlabService.createTag).not.toBeCalled();
    });
  });
  describe('Run method', () => {
    it('should call Github methods', async () => {
      myGitApiInfos.git = GitTypeEnum.Github;
      await createTagRunnable.run(CallbackType.Both, ruleResult, args);
      expect(githubService.createTag).toBeCalledWith({
        message: 'version v0.0.1',
        sha: '1',
        tag: 'v0.0.1',
        type: 'commit',
      });
      expect(githubService.createRef).toBeCalledWith({
        refName: 'refs/tags/v0.0.1',
        sha: 'tag',
      });
    });
  });
  describe('Run method', () => {
    it('should call Gitlab createTag method', async () => {
      myGitApiInfos.git = GitTypeEnum.Gitlab;
      await createTagRunnable.run(CallbackType.Both, ruleResult, args);
      expect(gitlabService.createTag).toBeCalledWith({
        message: 'version v0.0.1',
        sha: '1',
        tag: 'v0.0.1',
        type: 'commit',
      });
    });
  });
});
