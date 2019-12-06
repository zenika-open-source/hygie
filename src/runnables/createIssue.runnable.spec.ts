import { Test, TestingModule } from '@nestjs/testing';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { GitTypeEnum } from '../webhook/utils.enum';
import { CallbackType } from './runnables.service';
import { RuleResult } from '../rules/ruleResult';
import {
  MockGitlabService,
  MockGithubService,
  MockAnalytics,
} from '../__mocks__/mocks';
import { CreateIssueRunnable } from './createIssue.runnable';
import { logger } from '../logger/logger.service';
import { EnvVarAccessor } from '../env-var/env-var.accessor';
import { Webhook } from '../webhook/webhook';

describe('CreateIssueRunnable', () => {
  let app: TestingModule;

  let githubService: GithubService;
  let gitlabService: GitlabService;

  let createIssueRunnable: CreateIssueRunnable;

  let args: any;
  let ruleResultCommitMessage: RuleResult;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        CreateIssueRunnable,
        { provide: GitlabService, useClass: MockGitlabService },
        { provide: GithubService, useClass: MockGithubService },
        { provide: 'GoogleAnalytics', useValue: MockAnalytics },
        EnvVarAccessor,
      ],
    }).compile();

    githubService = app.get(GithubService);
    gitlabService = app.get(GitlabService);
    createIssueRunnable = app.get(CreateIssueRunnable);

    const webhook = new Webhook(gitlabService, githubService);
    webhook.branchName = 'test_webhook';

    args = {
      title: 'new issue',
      description:
        '{{data.branchName}} as a new commit which failed, find why.',
      labels: ['bug', 'urgent'],
    };

    // ruleResultIssueTitle initialisation
    ruleResultCommitMessage = new RuleResult(webhook);
    ruleResultCommitMessage.validated = true;
    ruleResultCommitMessage.data.commits = [
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
    ];
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('CreateIssue Runnable', () => {
    it('should not call the createIssue Github nor Gitlab service', () => {
      createIssueRunnable
        .run(CallbackType.Both, ruleResultCommitMessage, args)
        .catch(err => logger.error(err));
      expect(githubService.createIssue).not.toBeCalled();
      expect(gitlabService.createIssue).not.toBeCalled();
    });
  });
  describe('CreateIssue Runnable', () => {
    it('should call the createIssue Github service', () => {
      ruleResultCommitMessage.gitApiInfos.git = GitTypeEnum.Github;

      createIssueRunnable
        .run(CallbackType.Both, ruleResultCommitMessage, args)
        .catch(err => logger.error(err));

      expect(githubService.createIssue).toBeCalledWith({
        description: 'test_webhook as a new commit which failed, find why.',
        labels: ['bug', 'urgent'],
        title: 'new issue',
      });
      expect(gitlabService.createIssue).not.toBeCalled();
    });
  });
  describe('CreateIssue Runnable', () => {
    it('should call the createIssue Gitlab service', () => {
      ruleResultCommitMessage.gitApiInfos.git = GitTypeEnum.Gitlab;
      createIssueRunnable
        .run(CallbackType.Both, ruleResultCommitMessage, args)
        .catch(err => logger.error(err));

      expect(githubService.createIssue).not.toBeCalled();
      expect(gitlabService.createIssue).toBeCalledWith({
        description: 'test_webhook as a new commit which failed, find why.',
        labels: ['bug', 'urgent'],
        title: 'new issue',
      });
    });
  });
});
