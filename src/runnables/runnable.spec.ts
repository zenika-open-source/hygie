import { Test, TestingModule } from '@nestjs/testing';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { Webhook } from '../webhook/webhook';
import { HttpService } from '@nestjs/common';
import { GitTypeEnum } from '../webhook/utils.enum';
import { Runnable } from './runnable';
import { IssueTitleRule } from '../rules/issueTitle.rule';
import { RuleResult } from '../rules/ruleResult';
import { GitApiInfos } from '../git/gitApiInfos';
import {
  MockHttpService,
  MockGitlabService,
  MockGithubService,
} from '../__mocks__/mocks';
import { PullRequestTitleRule, BranchNameRule } from '../rules';

describe('RunnableService', () => {
  let app: TestingModule;

  let githubService: GithubService;
  let gitlabService: GitlabService;

  let runnableService: Runnable;

  let issueTitleRule: IssueTitleRule;
  let ruleResultIssueTitle: RuleResult;

  let pullRequestTitle: PullRequestTitleRule;
  let ruleResultPullRequestTitle: RuleResult;

  let branchName: BranchNameRule;
  let ruleResultBranchName: RuleResult;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        Runnable,
        { provide: HttpService, useClass: MockHttpService },
        { provide: GitlabService, useClass: MockGitlabService },
        { provide: GithubService, useClass: MockGithubService },
      ],
    }).compile();

    githubService = app.get(GithubService);
    gitlabService = app.get(GitlabService);
    runnableService = app.get(Runnable);

    const myGitApiInfos = new GitApiInfos();
    myGitApiInfos.repositoryFullName = 'bastienterrier/test_webhook';
    myGitApiInfos.git = GitTypeEnum.Undefined;

    // issueTitleRule initialisation
    issueTitleRule = new IssueTitleRule(
      new Webhook(gitlabService, githubService),
    );
    issueTitleRule.onSuccess = [
      {
        callback: 'CommentIssueRunnable',
        args: { comment: 'ping @bastienterrier' },
      },
    ];
    issueTitleRule.onError = [
      {
        callback: 'CommentIssueRunnable',
        args: { comment: 'ping @bastienterrier' },
      },
    ];
    // ruleResultIssueTitle initialisation
    ruleResultIssueTitle = new RuleResult(myGitApiInfos);
    ruleResultIssueTitle.validated = true;
    ruleResultIssueTitle.data = {
      issueNumber: 22,
    };

    /**
     *
     */

    // pullRequestTitleRule initialisation
    pullRequestTitle = new PullRequestTitleRule(
      new Webhook(gitlabService, githubService),
    );
    pullRequestTitle.onSuccess = [
      {
        callback: 'CommentPullRequestRunnable',
        args: { comment: 'ping @bastienterrier' },
      },
    ];
    pullRequestTitle.onError = [
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

    /**
     *
     */

    // branchNameRule initialisation
    branchName = new BranchNameRule(new Webhook(gitlabService, githubService));
    branchName.onSuccess = [
      {
        callback: 'CreatePullRequestRunnable',
        args: {
          title: 'WIP: {{data.branchSplit.1}}',
          description: 'this is the description',
        },
      },
    ];
    branchName.onError = [
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

  // CommentIssue Runnable
  describe('commentIssue Runnable', () => {
    it('should not call the addIssueComment Github nor Gitlab service', () => {
      runnableService.executeRunnableFunctions(
        ruleResultIssueTitle,
        issueTitleRule,
      );
      expect(githubService.addIssueComment).not.toBeCalled();
      expect(gitlabService.addIssueComment).not.toBeCalled();
    });
  });
  describe('commentIssue Runnable', () => {
    it('should call the addIssueComment Github service', () => {
      ruleResultIssueTitle.gitApiInfos.git = GitTypeEnum.Github;
      runnableService.executeRunnableFunctions(
        ruleResultIssueTitle,
        issueTitleRule,
      );
      expect(githubService.addIssueComment).toBeCalled();
      expect(gitlabService.addIssueComment).not.toBeCalled();
    });
  });
  describe('commentIssue Runnable', () => {
    it('should call the addIssueComment Gitlab service', () => {
      ruleResultIssueTitle.gitApiInfos.git = GitTypeEnum.Gitlab;
      runnableService.executeRunnableFunctions(
        ruleResultIssueTitle,
        issueTitleRule,
      );
      expect(githubService.addIssueComment).not.toBeCalled();
      expect(gitlabService.addIssueComment).toBeCalled();
    });
  });

  // CommentPullRequest Runnable
  describe('commentPullRequest Runnable', () => {
    it('should not call the addPRComment Github nor Gitlab service', () => {
      ruleResultPullRequestTitle.gitApiInfos.git = GitTypeEnum.Undefined;
      runnableService.executeRunnableFunctions(
        ruleResultPullRequestTitle,
        pullRequestTitle,
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
        pullRequestTitle,
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
        pullRequestTitle,
      );
      expect(githubService.addPRComment).not.toBeCalled();
      expect(gitlabService.addPRComment).toBeCalled();
    });
  });

  // CreatePullRequest Runnable
  describe('createPullRequest Runnable', () => {
    it('should not call the createPullRequest Github nor Gitlab service', () => {
      ruleResultBranchName.gitApiInfos.git = GitTypeEnum.Undefined;
      runnableService.executeRunnableFunctions(
        ruleResultBranchName,
        branchName,
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
        branchName,
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
        branchName,
      );
      expect(githubService.createPullRequest).not.toBeCalled();
      expect(gitlabService.createPullRequest).toBeCalled();
    });
  });
});
