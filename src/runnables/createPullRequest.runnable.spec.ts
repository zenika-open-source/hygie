import { Test, TestingModule } from '@nestjs/testing';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { GitTypeEnum } from '../webhook/utils.enum';
import { CallbackType } from './runnables.service';
import { RuleResult } from '../rules/ruleResult';
import { MockGitlabService, MockGithubService } from '../__mocks__/mocks';
import { CreatePullRequestRunnable } from './createPullRequest.runnable';
import { EnvVarAccessor } from '../env-var/env-var.accessor';
import { Webhook } from '../webhook/webhook';
import { Logger } from '@nestjs/common';

jest.mock('../analytics/analytics.decorator');

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
        EnvVarAccessor,
      ],
    }).compile();

    githubService = app.get(GithubService);
    gitlabService = app.get(GitlabService);
    createPullRequestRunnable = app.get(CreatePullRequestRunnable);

    const webhook = new Webhook(gitlabService, githubService);
    webhook.branchName = 'feature/webhook';

    args = {
      title: 'WIP: {{data.branchSplit.[1]}}',
      description: 'this is the description',
    };

    // ruleResultBranchName initialisation
    ruleResultBranchName = new RuleResult(webhook);
    ruleResultBranchName.validated = true;
    ruleResultBranchName.data.branchSplit = ['feature', 'webhook'];
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
        .catch(err => Logger.error(err));

      expect(githubService.createPullRequest).not.toBeCalled();
      expect(gitlabService.createPullRequest).not.toBeCalled();
    });
  });
  describe('createPullRequest Runnable', () => {
    it('should call the createPullRequest Github service', () => {
      ruleResultBranchName.gitApiInfos.git = GitTypeEnum.Github;
      createPullRequestRunnable
        .run(CallbackType.Both, ruleResultBranchName, args)
        .catch(err => Logger.error(err));

      expect(githubService.createPullRequest).toBeCalledWith({
        description: 'this is the description',
        source: '',
        target: 'master',
        title: 'WIP: webhook',
      });
      expect(gitlabService.createPullRequest).not.toBeCalled();
    });
  });
  describe('createPullRequest Runnable', () => {
    it('should call the createPullRequest Gitlab service', () => {
      ruleResultBranchName.gitApiInfos.git = GitTypeEnum.Gitlab;
      createPullRequestRunnable
        .run(CallbackType.Both, ruleResultBranchName, args)
        .catch(err => Logger.error(err));

      expect(githubService.createPullRequest).not.toBeCalled();
      expect(gitlabService.createPullRequest).toBeCalledWith({
        description: 'this is the description',
        source: '',
        target: 'master',
        title: 'WIP: webhook',
      });
    });
  });
});
