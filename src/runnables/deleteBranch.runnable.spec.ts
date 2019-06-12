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
import { DeleteBranchRunnable } from './deleteBranch.runnable';
import { logger } from '../logger/logger.service';

describe('DeleteBranchRunnable', () => {
  let app: TestingModule;

  let githubService: GithubService;
  let gitlabService: GitlabService;

  let deleteBranchRunnable: DeleteBranchRunnable;

  let args: any;
  let ruleResultBranchName: RuleResult;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        DeleteBranchRunnable,
        { provide: GitlabService, useClass: MockGitlabService },
        { provide: GithubService, useClass: MockGithubService },
        { provide: 'GoogleAnalytics', useValue: MockAnalytics },
      ],
    }).compile();

    githubService = app.get(GithubService);
    gitlabService = app.get(GitlabService);
    deleteBranchRunnable = app.get(DeleteBranchRunnable);

    const myGitApiInfos = new GitApiInfos();
    myGitApiInfos.repositoryFullName = 'bastienterrier/test_webhook';
    myGitApiInfos.git = GitTypeEnum.Undefined;

    args = {
      branchName: '{{data.branch}}',
    };
    // ruleResultBranchName initialisation
    ruleResultBranchName = new RuleResult(myGitApiInfos);
    ruleResultBranchName.validated = false;
    ruleResultBranchName.data = {
      branch: 'test/webhook',
      branchSplit: ['test', 'webhook'],
    };
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // DeleteBranch Runnable
  describe('deleteBranch Runnable', () => {
    it('should not call the deleteBranch Github nor Gitlab service', () => {
      ruleResultBranchName.gitApiInfos.git = GitTypeEnum.Undefined;
      deleteBranchRunnable
        .run(CallbackType.Both, ruleResultBranchName, args)
        .catch(err => logger.error(err));

      expect(githubService.deleteBranch).not.toBeCalled();
      expect(gitlabService.deleteBranch).not.toBeCalled();
    });
  });
  describe('deleteBranch Runnable', () => {
    it('should call the deleteBranch Github service', () => {
      ruleResultBranchName.gitApiInfos.git = GitTypeEnum.Github;
      deleteBranchRunnable
        .run(CallbackType.Both, ruleResultBranchName, args)
        .catch(err => logger.error(err));

      expect(githubService.deleteBranch).toBeCalledWith(
        { git: 'Github', repositoryFullName: 'bastienterrier/test_webhook' },
        'test&#x2F;webhook',
      );
      expect(gitlabService.deleteBranch).not.toBeCalled();
    });
  });
  describe('deleteBranch Runnable', () => {
    it('should call the deleteBranch Gitlab service', () => {
      ruleResultBranchName.gitApiInfos.git = GitTypeEnum.Gitlab;
      deleteBranchRunnable
        .run(CallbackType.Both, ruleResultBranchName, args)
        .catch(err => logger.error(err));

      expect(githubService.deleteBranch).not.toBeCalled();
      expect(gitlabService.deleteBranch).toBeCalledWith(
        { git: 'Gitlab', repositoryFullName: 'bastienterrier/test_webhook' },
        'test&#x2F;webhook',
      );
    });
  });
});
