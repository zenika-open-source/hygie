import { Test, TestingModule } from '@nestjs/testing';
import { GithubService } from '../../src/github/github.service';
import { GitlabService } from '../../src/gitlab/gitlab.service';
import { GitTypeEnum } from '../../src/webhook/utils.enum';
import { CallbackType } from '../../src/runnables/runnables.service';
import { RuleResult } from '../../src/rules/ruleResult';
import { GitApiInfos } from '../../src/git/gitApiInfos';
import {
  MockGitlabService,
  MockGithubService,
  MockAnalytics,
} from '../../src/__mocks__/mocks';
import { CreateIssueRunnable } from '../../src/runnables/createIssue.runnable';
import { logger } from '../../src/logger/logger.service';
import { EnvVarAccessor } from '../../src/env-var/env-var.accessor';

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

    const myGitApiInfos = new GitApiInfos();
    myGitApiInfos.repositoryFullName = 'bastienterrier/test_webhook';
    myGitApiInfos.git = GitTypeEnum.Undefined;

    args = {
      title: 'new issue',
      description: '{{data.branch}} as a new commit which failed, find why.',
      labels: ['bug', 'urgent'],
    };
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
