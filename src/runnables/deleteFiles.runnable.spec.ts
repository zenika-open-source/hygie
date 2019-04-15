import { Test, TestingModule } from '@nestjs/testing';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
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
import { BranchNameRule, CommitMessageRule } from '../rules';

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

    // branchNameRule initialisation
    commitMessageRule = new CommitMessageRule();
    commitMessageRule.onError = [
      {
        callback: 'DeleteFilesRunnable',
        args: {
          files: ['toto.txt', 'tata.exe'],
          message: 'delete files',
          branch: '{{data.branch}}',
        },
      },
    ];
    // ruleResultBranchName initialisation
    ruleResultCommitMessage = new RuleResult(myGitApiInfos);
    ruleResultCommitMessage.validated = false;
    ruleResultCommitMessage.data = {
      branch: 'feature/test',
      commits: [
        {
          status: 'Success',
          success: true,
          sha: '1',
          message: 'fix: readme (#12)',
          matches: ['fix: readme (#12)', 'fix', null, '(#12)'],
        },
      ],
    };
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // DeleteBranch Runnable
  describe('deleteFiles Runnable', () => {
    it('should not call the deleteFile Github nor Gitlab service', () => {
      ruleResultCommitMessage.gitApiInfos.git = GitTypeEnum.Undefined;
      runnableService.executeRunnableFunctions(
        ruleResultCommitMessage,
        commitMessageRule,
      );
      expect(githubService.deleteFile).not.toBeCalled();
      expect(gitlabService.deleteFile).not.toBeCalled();
    });
  });
  describe('deleteFiles Runnable', () => {
    it('should call the deleteFile Github service', () => {
      ruleResultCommitMessage.gitApiInfos.git = GitTypeEnum.Github;
      runnableService.executeRunnableFunctions(
        ruleResultCommitMessage,
        commitMessageRule,
      );
      expect(githubService.deleteFile).toHaveBeenNthCalledWith(
        1,
        {
          git: 'Github',
          repositoryFullName: 'bastienterrier/test_webhook',
        },
        {
          commitMessage: 'delete files',
          fileBranch: 'feature&#x2F;test',
          filePath: 'toto.txt',
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
          fileBranch: 'feature&#x2F;test',
          filePath: 'tata.exe',
        },
      );
      expect(gitlabService.deleteFile).not.toBeCalled();
    });
  });
  describe('deleteFiles Runnable', () => {
    it('should call the deleteFile Gitlab service', () => {
      ruleResultCommitMessage.gitApiInfos.git = GitTypeEnum.Gitlab;
      runnableService.executeRunnableFunctions(
        ruleResultCommitMessage,
        commitMessageRule,
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
          fileBranch: 'feature&#x2F;test',
          filePath: 'toto.txt',
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
          fileBranch: 'feature&#x2F;test',
          filePath: 'tata.exe',
        },
      );
    });
  });
});
