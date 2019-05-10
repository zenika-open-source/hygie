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
    branchNameRule.onSuccess = [
      {
        callback: 'CreatePullRequestRunnable',
        args: {
          title: 'WIP: {{data.branchSplit.1}}',
          description: 'this is the description',
        },
      },
    ];
    branchNameRule.onError = [
      {
        callback: 'CreatePullRequestRunnable',
        args: {
          title: 'WIP: {{data.branchSplit.1}}',
          description: 'this is the description',
        },
      },
    ];
    // ruleResultBranchName initialisation
    ruleResultBranchName = new RuleResult(myGitApiInfos);
    ruleResultBranchName.validated = true;
    ruleResultBranchName.data = {
      branch: 'feature/webhook',
      branchSplit: ['feature', 'webhook'],
    };
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // CreatePullRequest Runnable
  describe('createPullRequest Runnable', () => {
    it('should not call the createPullRequest Github nor Gitlab service', () => {
      ruleResultBranchName.gitApiInfos.git = GitTypeEnum.Undefined;
      runnableService.executeRunnableFunctions(
        ruleResultBranchName,
        branchNameRule,
      );
      expect(githubService.createPullRequest).not.toBeCalled();
      expect(gitlabService.createPullRequest).not.toBeCalled();
    });
  });
  describe('createPullRequest Runnable', () => {
    it('should call the createPullRequest Github service', () => {
      ruleResultBranchName.gitApiInfos.git = GitTypeEnum.Github;
      runnableService.executeRunnableFunctions(
        ruleResultBranchName,
        branchNameRule,
      );
      expect(githubService.createPullRequest).toBeCalled();
      expect(gitlabService.createPullRequest).not.toBeCalled();
    });
  });
  describe('createPullRequest Runnable', () => {
    it('should call the createPullRequest Gitlab service', () => {
      ruleResultBranchName.gitApiInfos.git = GitTypeEnum.Gitlab;
      runnableService.executeRunnableFunctions(
        ruleResultBranchName,
        branchNameRule,
      );
      expect(githubService.createPullRequest).not.toBeCalled();
      expect(gitlabService.createPullRequest).toBeCalled();
    });
  });
});
