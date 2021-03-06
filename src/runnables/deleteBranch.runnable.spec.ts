import { Test, TestingModule } from '@nestjs/testing';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { GitTypeEnum } from '../webhook/utils.enum';
import { CallbackType } from './runnables.service';
import { RuleResult } from '../rules/ruleResult';
import { MockGitlabService, MockGithubService } from '../__mocks__/mocks';
import { DeleteBranchRunnable } from './deleteBranch.runnable';
import { EnvVarAccessor } from '../env-var/env-var.accessor';
import { Webhook } from '../webhook/webhook';
import { Logger } from '@nestjs/common';

jest.mock('../analytics/analytics.decorator');

describe('DeleteBranchRunnable', () => {
  let app: TestingModule;

  let githubService: GithubService;
  let gitlabService: GitlabService;

  let deleteBranchRunnable: DeleteBranchRunnable;

  let args: any;
  let ruleResultBranchName: RuleResult;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        DeleteBranchRunnable,
        { provide: GitlabService, useClass: MockGitlabService },
        { provide: GithubService, useClass: MockGithubService },
        EnvVarAccessor,
      ],
    }).compile();

    githubService = app.get(GithubService);
    gitlabService = app.get(GitlabService);
    deleteBranchRunnable = app.get(DeleteBranchRunnable);

    const webhook = new Webhook(gitlabService, githubService);
    webhook.branchName = 'test/webhook';

    args = {
      branchName: '{{data.branchName}}',
    };
    // ruleResultBranchName initialisation
    ruleResultBranchName = new RuleResult(webhook);
    ruleResultBranchName.validated = false;
    ruleResultBranchName.data.branchSplit = ['test', 'webhook'];
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // DeleteBranch Runnable
  describe('deleteBranch Runnable', () => {
    it('should not call the deleteBranch Github nor Gitlab service', () => {
      ruleResultBranchName.gitApiInfos.git = GitTypeEnum.Undefined;
      deleteBranchRunnable
        .run(CallbackType.Both, ruleResultBranchName, args)
        .catch(err => Logger.error(err));

      expect(githubService.deleteBranch).not.toBeCalled();
      expect(gitlabService.deleteBranch).not.toBeCalled();
    });
  });
  describe('deleteBranch Runnable', () => {
    it('should call the deleteBranch Github service', () => {
      ruleResultBranchName.gitApiInfos.git = GitTypeEnum.Github;
      deleteBranchRunnable
        .run(CallbackType.Both, ruleResultBranchName, args)
        .catch(err => Logger.error(err));

      expect(githubService.deleteBranch).toBeCalledWith('test/webhook');
      expect(gitlabService.deleteBranch).not.toBeCalled();
    });
  });
  describe('deleteBranch Runnable', () => {
    it('should call the deleteBranch Gitlab service', () => {
      ruleResultBranchName.gitApiInfos.git = GitTypeEnum.Gitlab;
      deleteBranchRunnable
        .run(CallbackType.Both, ruleResultBranchName, args)
        .catch(err => Logger.error(err));

      expect(githubService.deleteBranch).not.toBeCalled();
      expect(gitlabService.deleteBranch).toBeCalledWith('test/webhook');
    });
  });
});
