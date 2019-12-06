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
import { DeployFolderRunnable } from '../../src/runnables/deployFolder.runnable';
import { EnvVarAccessor } from '../../src/env-var/env-var.accessor';

describe('DeployFolderRunnable', () => {
  let app: TestingModule;

  let githubService: GithubService;

  let myGitApiInfos;

  let deployFolderRunnable: DeployFolderRunnable;

  let args: any;
  let ruleResult: RuleResult;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        DeployFolderRunnable,
        { provide: GithubService, useClass: MockGithubService },
        { provide: 'GoogleAnalytics', useValue: MockAnalytics },
        EnvVarAccessor,
      ],
    }).compile();

    githubService = app.get(GithubService);
    deployFolderRunnable = app.get(DeployFolderRunnable);

    myGitApiInfos = new GitApiInfos();
    myGitApiInfos.repositoryFullName = 'bastienterrier/test_webhook';
    myGitApiInfos.git = GitTypeEnum.Undefined;

    args = { folder: 'docs', branch: 'gh-pages' };

    ruleResult = new RuleResult(myGitApiInfos);
    ruleResult.validated = false;
    ruleResult.data = {
      branch: 'develop',
    };
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
