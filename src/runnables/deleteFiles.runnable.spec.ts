import { Test, TestingModule } from '@nestjs/testing';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { GitTypeEnum } from '../webhook/utils.enum';
import { CallbackType } from './runnables.service';
import { RuleResult } from '../rules/ruleResult';
import { GitApiInfos } from '../git/gitApiInfos';
import {
  MockGitlabService,
  MockGithubService,
  MockAnalytics,
} from '../__mocks__/mocks';
import { DeleteFilesRunnable } from './deleteFiles.runnable';

describe('DeleteFilesRunnable', () => {
  let app: TestingModule;

  let githubService: GithubService;
  let gitlabService: GitlabService;

  let deleteFilesRunnable: DeleteFilesRunnable;

  let args: any;
  let ruleResultCheckAddedFiles: RuleResult;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        DeleteFilesRunnable,
        { provide: GitlabService, useClass: MockGitlabService },
        { provide: GithubService, useClass: MockGithubService },
        { provide: 'GoogleAnalytics', useValue: MockAnalytics },
      ],
    }).compile();

    githubService = app.get(GithubService);
    gitlabService = app.get(GitlabService);
    deleteFilesRunnable = app.get(DeleteFilesRunnable);

    const myGitApiInfos = new GitApiInfos();
    myGitApiInfos.repositoryFullName = 'bastienterrier/test_webhook';
    myGitApiInfos.git = GitTypeEnum.Undefined;

    args = {
      message: 'delete files',
      files: 'a.exe,b.exe',
    };
    // ruleResultBranchName initialisation
    ruleResultCheckAddedFiles = new RuleResult(myGitApiInfos);
    ruleResultCheckAddedFiles.validated = true;
    ruleResultCheckAddedFiles.data = {
      addedFiles: ['toto.exe', 'tata.exe'],
      branch: 'test_branch',
    };
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('deleteFiles Runnable', () => {
    it('should not call the deleteFile Github nor Gitlab service', () => {
      ruleResultCheckAddedFiles.gitApiInfos.git = GitTypeEnum.Undefined;
      deleteFilesRunnable.run(
        CallbackType.Both,
        ruleResultCheckAddedFiles,
        args,
      );

      expect(githubService.deleteFile).not.toBeCalled();
      expect(gitlabService.deleteFile).not.toBeCalled();
    });
  });
  describe('deleteFiles Runnable', () => {
    it('should call the deleteFile Github service', async () => {
      ruleResultCheckAddedFiles.gitApiInfos.git = GitTypeEnum.Github;
      await deleteFilesRunnable.run(
        CallbackType.Both,
        ruleResultCheckAddedFiles,
        args,
      );

      expect(githubService.deleteFile).toHaveBeenNthCalledWith(
        1,
        {
          git: 'Github',
          repositoryFullName: 'bastienterrier/test_webhook',
        },
        {
          commitMessage: 'delete files',
          fileBranch: 'test_branch',
          filePath: 'a.exe',
        },
      );
      expect(githubService.deleteFile).toHaveBeenNthCalledWith(
        2,
        {
          git: 'Github',
          repositoryFullName: 'bastienterrier/test_webhook',
        },
        {
          commitMessage: 'delete files',
          fileBranch: 'test_branch',
          filePath: 'b.exe',
        },
      );
      expect(gitlabService.deleteFile).not.toBeCalled();
    });
  });
  describe('deleteFiles Runnable', () => {
    it('should call the deleteFile Gitlab service', async () => {
      ruleResultCheckAddedFiles.gitApiInfos.git = GitTypeEnum.Gitlab;
      await deleteFilesRunnable.run(
        CallbackType.Both,
        ruleResultCheckAddedFiles,
        args,
      );

      expect(githubService.deleteFile).not.toBeCalled();
      expect(gitlabService.deleteFile).toHaveBeenNthCalledWith(
        1,
        {
          git: 'Gitlab',
          repositoryFullName: 'bastienterrier/test_webhook',
        },
        {
          commitMessage: 'delete files',
          fileBranch: 'test_branch',
          filePath: 'a.exe',
        },
      );
      expect(gitlabService.deleteFile).toHaveBeenNthCalledWith(
        2,
        {
          git: 'Gitlab',
          repositoryFullName: 'bastienterrier/test_webhook',
        },
        {
          commitMessage: 'delete files',
          fileBranch: 'test_branch',
          filePath: 'b.exe',
        },
      );
    });
  });
  describe('deleteFiles Runnable', () => {
    it('should call the deleteFile Github service', async () => {
      args = {
        message: 'delete files',
      };
      ruleResultCheckAddedFiles.gitApiInfos.git = GitTypeEnum.Github;
      await deleteFilesRunnable.run(
        CallbackType.Both,
        ruleResultCheckAddedFiles,
        args,
      );

      expect(githubService.deleteFile).toHaveBeenNthCalledWith(
        1,
        {
          git: 'Github',
          repositoryFullName: 'bastienterrier/test_webhook',
        },
        {
          commitMessage: 'delete files',
          fileBranch: 'test_branch',
          filePath: 'toto.exe',
        },
      );
      expect(githubService.deleteFile).toHaveBeenNthCalledWith(
        2,
        {
          git: 'Github',
          repositoryFullName: 'bastienterrier/test_webhook',
        },
        {
          commitMessage: 'delete files',
          fileBranch: 'test_branch',
          filePath: 'tata.exe',
        },
      );
      expect(gitlabService.deleteFile).not.toBeCalled();
    });
  });
  describe('deleteFiles Runnable', () => {
    it('should call the deleteFile Gitlab service', async () => {
      ruleResultCheckAddedFiles.gitApiInfos.git = GitTypeEnum.Gitlab;
      await deleteFilesRunnable.run(
        CallbackType.Both,
        ruleResultCheckAddedFiles,
        args,
      );

      expect(githubService.deleteFile).not.toBeCalled();
      expect(gitlabService.deleteFile).toHaveBeenNthCalledWith(
        1,
        {
          git: 'Gitlab',
          repositoryFullName: 'bastienterrier/test_webhook',
        },
        {
          commitMessage: 'delete files',
          fileBranch: 'test_branch',
          filePath: 'toto.exe',
        },
      );
      expect(gitlabService.deleteFile).toHaveBeenNthCalledWith(
        2,
        {
          git: 'Gitlab',
          repositoryFullName: 'bastienterrier/test_webhook',
        },
        {
          commitMessage: 'delete files',
          fileBranch: 'test_branch',
          filePath: 'tata.exe',
        },
      );
    });
  });
  describe('deleteFiles Runnable', () => {
    it('should call the deleteFile Github service', async () => {
      args = {
        message: 'delete files',
        files: ['c.exe', 'd.exe'],
      };
      ruleResultCheckAddedFiles.gitApiInfos.git = GitTypeEnum.Github;
      await deleteFilesRunnable.run(
        CallbackType.Both,
        ruleResultCheckAddedFiles,
        args,
      );

      expect(githubService.deleteFile).toHaveBeenNthCalledWith(
        1,
        {
          git: 'Github',
          repositoryFullName: 'bastienterrier/test_webhook',
        },
        {
          commitMessage: 'delete files',
          fileBranch: 'test_branch',
          filePath: 'c.exe',
        },
      );
      expect(githubService.deleteFile).toHaveBeenNthCalledWith(
        2,
        {
          git: 'Github',
          repositoryFullName: 'bastienterrier/test_webhook',
        },
        {
          commitMessage: 'delete files',
          fileBranch: 'test_branch',
          filePath: 'd.exe',
        },
      );
      expect(gitlabService.deleteFile).not.toBeCalled();
    });
  });
  describe('deleteFiles Runnable', () => {
    it('should call the deleteFile Gitlab service', async () => {
      ruleResultCheckAddedFiles.gitApiInfos.git = GitTypeEnum.Gitlab;
      await deleteFilesRunnable.run(
        CallbackType.Both,
        ruleResultCheckAddedFiles,
        args,
      );

      expect(githubService.deleteFile).not.toBeCalled();
      expect(gitlabService.deleteFile).toHaveBeenNthCalledWith(
        1,
        {
          git: 'Gitlab',
          repositoryFullName: 'bastienterrier/test_webhook',
        },
        {
          commitMessage: 'delete files',
          fileBranch: 'test_branch',
          filePath: 'c.exe',
        },
      );
      expect(gitlabService.deleteFile).toHaveBeenNthCalledWith(
        2,
        {
          git: 'Gitlab',
          repositoryFullName: 'bastienterrier/test_webhook',
        },
        {
          commitMessage: 'delete files',
          fileBranch: 'test_branch',
          filePath: 'd.exe',
        },
      );
    });
  });
});
