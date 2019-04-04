import { Test, TestingModule } from '@nestjs/testing';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { HttpService } from '@nestjs/common';
import { GitTypeEnum } from '../webhook/utils.enum';
import { RunnablesService } from './runnables.service';
import { RuleResult } from '../rules/ruleResult';
import { GitApiInfos } from '../git/gitApiInfos';
import {
  MockHttpService,
  MockGitlabService,
  MockGithubService,
} from '../__mocks__/mocks';
import { BranchNameRule } from '../rules';

describe('RunnableService', () => {
  let app: TestingModule;

  let githubService: GithubService;
  let gitlabService: GitlabService;

  let runnableService: RunnablesService;

  let branchNameRule: BranchNameRule;
  let ruleResultBranchName: RuleResult;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        RunnablesService,
        { provide: HttpService, useClass: MockHttpService },
        { provide: GitlabService, useClass: MockGitlabService },
        { provide: GithubService, useClass: MockGithubService },
      ],
    }).compile();

    githubService = app.get(GithubService);
    gitlabService = app.get(GitlabService);
    runnableService = app.get(RunnablesService);

    const myGitApiInfos = new GitApiInfos();
    myGitApiInfos.repositoryFullName = 'bastienterrier/test_webhook';
    myGitApiInfos.git = GitTypeEnum.Undefined;

    // branchNameRule initialisation
    branchNameRule = new BranchNameRule();
    branchNameRule.onError = [
      {
        callback: 'DeleteBranchRunnable',
        args: {
          branchName: '{{data.branch}}',
        },
      },
    ];
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
      runnableService.executeRunnableFunctions(
        ruleResultBranchName,
        branchNameRule,
      );
      expect(githubService.deleteBranch).not.toBeCalled();
      expect(gitlabService.deleteBranch).not.toBeCalled();
    });
  });
  describe('deleteBranch Runnable', () => {
    it('should call the deleteBranch Github service', () => {
      ruleResultBranchName.gitApiInfos.git = GitTypeEnum.Github;
      runnableService.executeRunnableFunctions(
        ruleResultBranchName,
        branchNameRule,
      );
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
      runnableService.executeRunnableFunctions(
        ruleResultBranchName,
        branchNameRule,
      );
      expect(githubService.deleteBranch).not.toBeCalled();
      expect(gitlabService.deleteBranch).toBeCalledWith(
        { git: 'Gitlab', repositoryFullName: 'bastienterrier/test_webhook' },
        'test&#x2F;webhook',
      );
    });
  });
});
