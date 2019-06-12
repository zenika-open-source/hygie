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
import { UpdateCommitStatusRunnable } from './updateCommitStatus.runnable';
import { logger } from '../logger/logger.service';

describe('UpdateCommitStatusRunnable', () => {
  let app: TestingModule;

  let githubService: GithubService;
  let gitlabService: GitlabService;

  let updateCommitStatus: UpdateCommitStatusRunnable;

  let args: any;
  let ruleResultCommitMessage: RuleResult;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        UpdateCommitStatusRunnable,
        { provide: GitlabService, useClass: MockGitlabService },
        { provide: GithubService, useClass: MockGithubService },
        { provide: 'GoogleAnalytics', useValue: MockAnalytics },
      ],
    }).compile();

    githubService = app.get(GithubService);
    gitlabService = app.get(GitlabService);
    updateCommitStatus = app.get(UpdateCommitStatusRunnable);

    const myGitApiInfos = new GitApiInfos();
    myGitApiInfos.repositoryFullName = 'bastienterrier/test_webhook';
    myGitApiInfos.git = GitTypeEnum.Undefined;

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
    args = {
      successTargetUrl: 'http://www.google.com',
      failTargetUrl: 'http://moogle.com/',
      successDescriptionMessage: 'good commit status!',
      failDescriptionMessage: 'NOOOT good...',
    };
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('updateCommitMessage Runnable', () => {
    it('should not call the updateCommitStatus Github nor Gitlab service', () => {
      updateCommitStatus
        .run(CallbackType.Both, ruleResultCommitMessage, args)
        .catch(err => logger.error(err));
      expect(githubService.updateCommitStatus).not.toBeCalled();
      expect(gitlabService.updateCommitStatus).not.toBeCalled();
    });
  });
  describe('updateCommitMessage Runnable', () => {
    it('should call the updateCommitStatus Github service 3 times', () => {
      ruleResultCommitMessage.gitApiInfos.git = GitTypeEnum.Github;
      updateCommitStatus
        .run(CallbackType.Both, ruleResultCommitMessage, args)
        .catch(err => logger.error(err));

      expect(githubService.updateCommitStatus).toBeCalledTimes(3);
      expect(gitlabService.updateCommitStatus).not.toBeCalled();
    });
  });
  describe('updateCommitMessage Runnable', () => {
    it('should call the updateCommitStatus Gitlab service 3 times', () => {
      ruleResultCommitMessage.gitApiInfos.git = GitTypeEnum.Gitlab;
      updateCommitStatus
        .run(CallbackType.Both, ruleResultCommitMessage, args)
        .catch(err => logger.error(err));

      expect(githubService.updateCommitStatus).not.toBeCalled();
      expect(gitlabService.updateCommitStatus).toBeCalledTimes(3);
    });
  });
});
