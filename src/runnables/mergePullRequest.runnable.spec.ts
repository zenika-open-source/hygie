import { Test, TestingModule } from '@nestjs/testing';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { Webhook } from '../webhook/webhook';
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
import { PullRequestTitleRule } from '../rules';

describe('RunnableService', () => {
  let app: TestingModule;

  let githubService: GithubService;
  let gitlabService: GitlabService;

  let runnableService: RunnablesService;

  let pullRequestTitleRule: PullRequestTitleRule;
  let ruleResultPullRequestTitle: RuleResult;

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

    // pullRequestTitleRule initialisation
    pullRequestTitleRule = new PullRequestTitleRule();
    pullRequestTitleRule.onSuccess = [
      {
        callback: 'MergePullRequestRunnable',
        // args: { commitTitle: 'merging the PR...' },
      },
    ];
    // ruleResultPullRequestTitle initialisation
    ruleResultPullRequestTitle = new RuleResult(myGitApiInfos);
    ruleResultPullRequestTitle.validated = true;
    ruleResultPullRequestTitle.data = {
      pullRequestTitle: 'WIP: webhook',
      pullRequestNumber: 22,
      pullRequestDescription: 'my desc',
    };
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('mergePullRequest Runnable', () => {
    it('should not call the mergePullRequest Github nor Gitlab service', () => {
      ruleResultPullRequestTitle.gitApiInfos.git = GitTypeEnum.Undefined;
      runnableService.executeRunnableFunctions(
        ruleResultPullRequestTitle,
        pullRequestTitleRule,
      );
      expect(githubService.mergePullRequest).not.toBeCalled();
      expect(gitlabService.mergePullRequest).not.toBeCalled();
    });
  });
  describe('mergePullRequest Runnable', () => {
    it('should call the mergePullRequest Githubservice', () => {
      ruleResultPullRequestTitle.gitApiInfos.git = GitTypeEnum.Github;
      runnableService.executeRunnableFunctions(
        ruleResultPullRequestTitle,
        pullRequestTitleRule,
      );
      expect(githubService.mergePullRequest).toBeCalled();
      expect(gitlabService.mergePullRequest).not.toBeCalled();
    });
  });
  describe('mergePullRequest Runnable', () => {
    it('should call the mergePullRequest Gitlab service', () => {
      ruleResultPullRequestTitle.gitApiInfos.git = GitTypeEnum.Gitlab;
      runnableService.executeRunnableFunctions(
        ruleResultPullRequestTitle,
        pullRequestTitleRule,
      );
      expect(githubService.mergePullRequest).not.toBeCalled();
      expect(gitlabService.mergePullRequest).toBeCalled();
    });
  });
});
