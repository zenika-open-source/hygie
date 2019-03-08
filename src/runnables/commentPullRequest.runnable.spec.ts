import { Test, TestingModule } from '@nestjs/testing';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { Webhook } from '../webhook/webhook';
import { HttpService } from '@nestjs/common';
import { GitTypeEnum } from '../webhook/utils.enum';
import { RunnableService } from './runnable';
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

  let runnableService: RunnableService;

  let pullRequestTitleRule: PullRequestTitleRule;
  let ruleResultPullRequestTitle: RuleResult;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        RunnableService,
        { provide: HttpService, useClass: MockHttpService },
        { provide: GitlabService, useClass: MockGitlabService },
        { provide: GithubService, useClass: MockGithubService },
      ],
    }).compile();

    githubService = app.get(GithubService);
    gitlabService = app.get(GitlabService);
    runnableService = app.get(RunnableService);

    const myGitApiInfos = new GitApiInfos();
    myGitApiInfos.repositoryFullName = 'bastienterrier/test_webhook';
    myGitApiInfos.git = GitTypeEnum.Undefined;

    // pullRequestTitleRule initialisation
    pullRequestTitleRule = new PullRequestTitleRule();
    pullRequestTitleRule.onSuccess = [
      {
        callback: 'CommentPullRequestRunnable',
        args: { comment: 'ping @bastienterrier' },
      },
    ];
    pullRequestTitleRule.onError = [
      {
        callback: 'CommentPullRequestRunnable',
        args: { comment: 'ping @bastienterrier' },
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

  describe('commentPullRequest Runnable', () => {
    it('should not call the addPRComment Github nor Gitlab service', () => {
      ruleResultPullRequestTitle.gitApiInfos.git = GitTypeEnum.Undefined;
      runnableService.executeRunnableFunctions(
        ruleResultPullRequestTitle,
        pullRequestTitleRule,
      );
      expect(githubService.addPRComment).not.toBeCalled();
      expect(gitlabService.addPRComment).not.toBeCalled();
    });
  });
  describe('commentPullRequest Runnable', () => {
    it('should call the addPRComment Githubservice', () => {
      ruleResultPullRequestTitle.gitApiInfos.git = GitTypeEnum.Github;
      runnableService.executeRunnableFunctions(
        ruleResultPullRequestTitle,
        pullRequestTitleRule,
      );
      expect(githubService.addPRComment).toBeCalled();
      expect(gitlabService.addPRComment).not.toBeCalled();
    });
  });
  describe('commentPullRequest Runnable', () => {
    it('should call the addPRComment Gitlab service', () => {
      ruleResultPullRequestTitle.gitApiInfos.git = GitTypeEnum.Gitlab;
      runnableService.executeRunnableFunctions(
        ruleResultPullRequestTitle,
        pullRequestTitleRule,
      );
      expect(githubService.addPRComment).not.toBeCalled();
      expect(gitlabService.addPRComment).toBeCalled();
    });
  });
});
