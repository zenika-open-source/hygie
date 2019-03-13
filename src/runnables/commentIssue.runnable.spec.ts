import { Test, TestingModule } from '@nestjs/testing';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { Webhook } from '../webhook/webhook';
import { HttpService } from '@nestjs/common';
import { GitTypeEnum } from '../webhook/utils.enum';
import { RunnablesService } from './runnables.service';
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

  let runnableService: RunnablesService;

  let issueTitleRule: IssueTitleRule;
  let ruleResultIssueTitle: RuleResult;

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

    // issueTitleRule initialisation
    issueTitleRule = new IssueTitleRule();
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
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

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
});
