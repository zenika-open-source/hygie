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
import { CreatePullRequestRunnable } from './createPullRequest.runnable';
import { logger } from '../logger/logger.service';

describe('CreatePullRequestRunnable', () => {
  let app: TestingModule;

  let githubService: GithubService;
  let gitlabService: GitlabService;

  let createPullRequestRunnable: CreatePullRequestRunnable;

  let args: any;
  let ruleResultBranchName: RuleResult;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        CreatePullRequestRunnable,
        { provide: GitlabService, useClass: MockGitlabService },
        { provide: GithubService, useClass: MockGithubService },
        { provide: 'GoogleAnalytics', useValue: MockAnalytics },
      ],
    }).compile();

    githubService = app.get(GithubService);
    gitlabService = app.get(GitlabService);
    createPullRequestRunnable = app.get(CreatePullRequestRunnable);

    const myGitApiInfos = new GitApiInfos();
    myGitApiInfos.repositoryFullName = 'bastienterrier/test_webhook';
    myGitApiInfos.git = GitTypeEnum.Undefined;

    args = {
      title: 'WIP: {{data.branchSplit.1}}',
      description: 'this is the description',
    };

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
      createPullRequestRunnable
        .run(CallbackType.Both, ruleResultBranchName, args)
        .catch(err => logger.error(err));

      expect(githubService.createPullRequest).not.toBeCalled();
      expect(gitlabService.createPullRequest).not.toBeCalled();
    });
  });
  describe('createPullRequest Runnable', () => {
    it('should call the createPullRequest Github service', () => {
      ruleResultBranchName.gitApiInfos.git = GitTypeEnum.Github;
      createPullRequestRunnable
        .run(CallbackType.Both, ruleResultBranchName, args)
        .catch(err => logger.error(err));

      expect(githubService.createPullRequest).toBeCalled();
      expect(gitlabService.createPullRequest).not.toBeCalled();
    });
  });
  describe('createPullRequest Runnable', () => {
    it('should call the createPullRequest Gitlab service', () => {
      ruleResultBranchName.gitApiInfos.git = GitTypeEnum.Gitlab;
      createPullRequestRunnable
        .run(CallbackType.Both, ruleResultBranchName, args)
        .catch(err => logger.error(err));

      expect(githubService.createPullRequest).not.toBeCalled();
      expect(gitlabService.createPullRequest).toBeCalled();
    });
  });
});
