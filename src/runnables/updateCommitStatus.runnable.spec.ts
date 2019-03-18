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
    commitMessageRule.onBoth = [
      {
        callback: 'UpdateCommitStatusRunnable',
        args: {
          uccessTargetUrl: 'http://www.google.com',
          failTargetUrl: 'http://moogle.com/',
          successDescriptionMessage: 'good commit status!',
          failDescriptionMessage: 'NOOOT good...',
        },
      },
    ];

    // ruleResultBranchName initialisation
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

  describe('updateCommitMessage Runnable', () => {
    it('should not call the updateCommitStatus Github nor Gitlab service', () => {
      ruleResultCommitMessage.gitApiInfos.git = GitTypeEnum.Undefined;
      runnableService.executeRunnableFunctions(
        ruleResultCommitMessage,
        commitMessageRule,
      );
      expect(githubService.updateCommitStatus).not.toBeCalled();
      expect(gitlabService.updateCommitStatus).not.toBeCalled();
    });
  });
  describe('updateCommitMessage Runnable', () => {
    it('should call the updateCommitStatus Github service 3 times', () => {
      ruleResultCommitMessage.gitApiInfos.git = GitTypeEnum.Github;
      runnableService.executeRunnableFunctions(
        ruleResultCommitMessage,
        commitMessageRule,
      );
      expect(githubService.updateCommitStatus).toBeCalledTimes(3);
      expect(gitlabService.updateCommitStatus).not.toBeCalled();
    });
  });
  describe('updateCommitMessage Runnable', () => {
    it('should call the updateCommitStatus Gitlab service 3 times', () => {
      ruleResultCommitMessage.gitApiInfos.git = GitTypeEnum.Gitlab;
      runnableService.executeRunnableFunctions(
        ruleResultCommitMessage,
        commitMessageRule,
      );
      expect(githubService.updateCommitStatus).not.toBeCalled();
      expect(gitlabService.updateCommitStatus).toBeCalledTimes(3);
    });
  });
});
