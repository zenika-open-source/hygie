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
import { UpdatePullRequestRunnable } from '../../src/runnables';
import { logger } from '../../src/logger/logger.service';
import { EnvVarAccessor } from '../../src/env-var/env-var.accessor';

describe('UpdatePullRequestRunnable', () => {
  let app: TestingModule;

  let githubService: GithubService;
  let gitlabService: GitlabService;

  let updatePullRequestRunnable: UpdatePullRequestRunnable;

  let args: any;
  let ruleResultPullRequestTitle: RuleResult;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        UpdatePullRequestRunnable,
        { provide: GitlabService, useClass: MockGitlabService },
        { provide: GithubService, useClass: MockGithubService },
        { provide: 'GoogleAnalytics', useValue: MockAnalytics },
        EnvVarAccessor,
      ],
    }).compile();

    githubService = app.get(GithubService);
    gitlabService = app.get(GitlabService);
    updatePullRequestRunnable = app.get(UpdatePullRequestRunnable);

    const myGitApiInfos = new GitApiInfos();
    myGitApiInfos.repositoryFullName = 'bastienterrier/test_webhook';
    myGitApiInfos.git = GitTypeEnum.Undefined;

    args = {
      title: 'Default title',
    };

    // ruleResultPullRequestTitle initialisation
    ruleResultPullRequestTitle = new RuleResult(myGitApiInfos);
    ruleResultPullRequestTitle.validated = false;
    ruleResultPullRequestTitle.data = {
      pullRequest: {
        title: 'Bad title',
        number: 22,
        description: 'my desc',
      },
    };
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('updatePullRequest Runnable', () => {
    it('should not call the updatePullRequest Github nor Gitlab service', () => {
      ruleResultPullRequestTitle.gitApiInfos.git = GitTypeEnum.Undefined;
      updatePullRequestRunnable
        .run(CallbackType.Both, ruleResultPullRequestTitle, args)
        .catch(err => logger.error(err));

      expect(githubService.updatePullRequest).not.toBeCalled();
      expect(gitlabService.updatePullRequest).not.toBeCalled();
    });
  });
  describe('updatePullRequest Runnable', () => {
    it('should call the updatePullRequest Githubservice', () => {
      ruleResultPullRequestTitle.gitApiInfos.git = GitTypeEnum.Github;
      updatePullRequestRunnable
        .run(CallbackType.Both, ruleResultPullRequestTitle, args)
        .catch(err => logger.error(err));
      expect(githubService.updatePullRequest).toBeCalled();
      expect(gitlabService.updatePullRequest).not.toBeCalled();
    });
  });
  describe('updatePullRequest Runnable', () => {
    it('should call the updatePullRequest Gitlab service', () => {
      ruleResultPullRequestTitle.gitApiInfos.git = GitTypeEnum.Gitlab;
      updatePullRequestRunnable
        .run(CallbackType.Both, ruleResultPullRequestTitle, args)
        .catch(err => logger.error(err));
      expect(githubService.updatePullRequest).not.toBeCalled();
      expect(gitlabService.updatePullRequest).toBeCalled();
    });
  });
});
