import { Test, TestingModule } from '@nestjs/testing';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { GitTypeEnum } from '../webhook/utils.enum';
import { CallbackType } from './runnables.service';
import { RuleResult } from '../rules/ruleResult';
import { GitApiInfos } from '../git/gitApiInfos';
import { MockGitlabService, MockGithubService } from '../__mocks__/mocks';
import { DeployFolderRunnable } from './deployFolder.runnable';

describe('DeployFolderRunnable', () => {
  let app: TestingModule;

  let githubService: GithubService;
  let gitlabService: GitlabService;

  let myGitApiInfos;

  let deployFolderRunnable: DeployFolderRunnable;

  let args: any;
  let ruleResult: RuleResult;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        DeployFolderRunnable,
        { provide: GitlabService, useClass: MockGitlabService },
        { provide: GithubService, useClass: MockGithubService },
      ],
    }).compile();

    githubService = app.get(GithubService);
    gitlabService = app.get(GitlabService);
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
      expect(githubService.getTree).toBeCalledWith(
        myGitApiInfos,
        'docs',
        'develop',
      );
      expect(githubService.getLastCommit).toBeCalledWith(
        myGitApiInfos,
        'gh-pages',
      );
      expect(githubService.createCommit).toBeCalledWith(myGitApiInfos, {
        message: 'deploy docs to gh-pages',
        parents: ['commit'],
        tree: 'tree',
      });

      expect(githubService.updateRef).toBeCalled();
    });
  });
});