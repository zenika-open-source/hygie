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
import { CommitMessageRule } from '../rules';

describe('RunnableService', () => {
  let app: TestingModule;

  let githubService: GithubService;
  let gitlabService: GitlabService;

  let runnableService: RunnablesService;

  let commitMessageRule: CommitMessageRule;
  let ruleResultCommitMessage: RuleResult;

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
    commitMessageRule = new CommitMessageRule();
    commitMessageRule.onSuccess = [
      {
        callback: 'CreateIssueRunnable',
        args: {
          title: 'new issue',
          description:
            '{{data.branch}} as a new commit which failed, find why.',
          labels: ['bug', 'urgent'],
        },
      },
    ];

    // ruleResultIssueTitle initialisation
    ruleResultCommitMessage = new RuleResult(myGitApiInfos);
    ruleResultCommitMessage.validated = true;
    ruleResultCommitMessage.data = {
      branch: 'test_webhook',
      commits: [
        {
          status: 'Success',
          success: true,
          sha: '1',
          message: 'fix: readme (#12)',
          matches: ['fix: readme (#12)', 'fix', null, '(#12)'],
        },
        {
          status: 'Success',
          success: true,
          sha: '2',
          message: 'feat(test): tdd (#34)',
          matches: ['feat(test): tdd (#34)', 'feat', '(test)', '(#34)'],
        },
        {
          status: 'Success',
          success: true,
          sha: '3',
          message: 'docs: gh-pages',
          matches: ['docs: gh-pages', 'docs', null, null],
        },
      ],
    };
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('CreateIssue Runnable', () => {
    it('should not call the createIssue Github nor Gitlab service', () => {
      runnableService.executeRunnableFunctions(
        ruleResultCommitMessage,
        commitMessageRule,
      );
      expect(githubService.createIssue).not.toBeCalled();
      expect(gitlabService.createIssue).not.toBeCalled();
    });
  });
  describe('CreateIssue Runnable', () => {
    it('should call the createIssue Github service', () => {
      ruleResultCommitMessage.gitApiInfos.git = GitTypeEnum.Github;
      runnableService.executeRunnableFunctions(
        ruleResultCommitMessage,
        commitMessageRule,
      );
      expect(githubService.createIssue).toBeCalledWith(
        { git: 'Github', repositoryFullName: 'bastienterrier/test_webhook' },
        {
          description: 'test_webhook as a new commit which failed, find why.',
          labels: ['bug', 'urgent'],
          title: 'new issue',
        },
      );
      expect(gitlabService.createIssue).not.toBeCalled();
    });
  });
  describe('CreateIssue Runnable', () => {
    it('should call the createIssue Gitlab service', () => {
      ruleResultCommitMessage.gitApiInfos.git = GitTypeEnum.Gitlab;
      runnableService.executeRunnableFunctions(
        ruleResultCommitMessage,
        commitMessageRule,
      );
      expect(githubService.createIssue).not.toBeCalled();
      expect(gitlabService.createIssue).toBeCalledWith(
        { git: 'Gitlab', repositoryFullName: 'bastienterrier/test_webhook' },
        {
          description: 'test_webhook as a new commit which failed, find why.',
          labels: ['bug', 'urgent'],
          title: 'new issue',
        },
      );
    });
  });
});
