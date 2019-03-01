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

describe('RunnableService', () => {
  let app: TestingModule;
  let githubService: GithubService;
  let gitlabService: GitlabService;
  let runnableService: Runnable;
  let issueTitleRule: IssueTitleRule;
  let ruleResult: RuleResult;

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

    // issueTitleRule initialisation
    issueTitleRule = new IssueTitleRule(
      new Webhook(gitlabService, githubService),
    );
    issueTitleRule.onSuccess = [
      {
        callback: 'CommentIssueRunnable',
        args: [{ comment: 'ping @bastienterrier' }],
      },
    ];
    issueTitleRule.onError = [
      {
        callback: 'CommentIssueRunnable',
        args: [{ comment: 'ping @bastienterrier' }],
      },
    ];

    // ruleResult initialisation
    const myGitApiInfos = new GitApiInfos();
    myGitApiInfos.repositoryFullName = 'bastienterrier/test_webhook';
    myGitApiInfos.git = GitTypeEnum.Undefined;
    ruleResult = new RuleResult(myGitApiInfos);
    ruleResult.validated = true;
    ruleResult.data = {
      issueNumber: 22,
    };
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('commentIssue Runnable', () => {
    it('should not call the addIssueComment Github nor Gitlab service', () => {
      runnableService.executeRunnableFunctions(ruleResult, issueTitleRule);
      expect(githubService.addIssueComment).not.toBeCalled();
      expect(gitlabService.addIssueComment).not.toBeCalled();
    });
  });

  describe('commentIssue Runnable', () => {
    it('should call the addIssueComment Github service', () => {
      ruleResult.gitApiInfos.git = GitTypeEnum.Github;
      runnableService.executeRunnableFunctions(ruleResult, issueTitleRule);
      expect(githubService.addIssueComment).toBeCalled();
      expect(gitlabService.addIssueComment).not.toBeCalled();
    });
  });

  describe('commentIssue Runnable', () => {
    it('should call the addIssueComment Gitlab service', () => {
      ruleResult.gitApiInfos.git = GitTypeEnum.Gitlab;
      runnableService.executeRunnableFunctions(ruleResult, issueTitleRule);
      expect(githubService.addIssueComment).not.toBeCalled();
      expect(gitlabService.addIssueComment).toBeCalled();
    });
  });
});
