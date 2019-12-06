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
import { DeployFolderRunnable } from './deployFolder.runnable';
import { EnvVarAccessor } from '../env-var/env-var.accessor';
import { Webhook } from '../webhook/webhook';

describe('DeployFolderRunnable', () => {
  let app: TestingModule;

  let githubService: GithubService;
  let gitlabService: GitlabService;

  let deployFolderRunnable: DeployFolderRunnable;

  let args: any;
  let ruleResult: RuleResult;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        DeployFolderRunnable,
        { provide: GithubService, useClass: MockGithubService },
        { provide: GitlabService, useClass: MockGitlabService },
        { provide: 'GoogleAnalytics', useValue: MockAnalytics },
        EnvVarAccessor,
      ],
    }).compile();

    githubService = app.get(GithubService);
    gitlabService = app.get(GitlabService);
    deployFolderRunnable = app.get(DeployFolderRunnable);

    const webhook = new Webhook(gitlabService, githubService);
    webhook.branchName = 'develop';

    args = { folder: 'docs', branch: 'gh-pages' };

    ruleResult = new RuleResult(webhook);
    ruleResult.validated = false;

  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Run method', () => {
    it('should not do anything', async () => {
      await deployFolderRunnable.run(CallbackType.Both, ruleResult, args);
      expect(githubService.getTree).not.toBeCalled();
    });
  });
  describe('Run method', () => {
    it('should call Github methods', async () => {
      myGitApiInfos.git = GitTypeEnum.Github;
      await deployFolderRunnable.run(CallbackType.Both, ruleResult, args);
      expect(githubService.getTree).toBeCalledWith('docs', 'develop');
      expect(githubService.getLastCommit).toBeCalledWith('gh-pages');
      expect(githubService.createCommit).toBeCalledWith({
        message: 'deploy docs to gh-pages',
        parents: ['commit'],
        tree: 'tree',
      });

      expect(githubService.updateRef).toBeCalled();
    });
  });
});
