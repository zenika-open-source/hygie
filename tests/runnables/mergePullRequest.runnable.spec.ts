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
import { MergePullRequestRunnable } from '../../src/runnables/mergePullRequest.runnable';
import { logger } from '../../src/logger/logger.service';
import { EnvVarAccessor } from '../../src/env-var/env-var.accessor';

describe('MergePullRequestRunnable', () => {
  let app: TestingModule;

  let githubService: GithubService;
  let gitlabService: GitlabService;

  let mergePullRequestRunnable: MergePullRequestRunnable;

  let args: any;
  let ruleResultPullRequestTitle: RuleResult;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        MergePullRequestRunnable,
        { provide: GitlabService, useClass: MockGitlabService },
        { provide: GithubService, useClass: MockGithubService },
        { provide: 'GoogleAnalytics', useValue: MockAnalytics },
        EnvVarAccessor,
      ],
    }).compile();

    githubService = app.get(GithubService);
    gitlabService = app.get(GitlabService);
    mergePullRequestRunnable = app.get(MergePullRequestRunnable);

    const myGitApiInfos = new GitApiInfos();
    myGitApiInfos.repositoryFullName = 'bastienterrier/test_webhook';
    myGitApiInfos.git = GitTypeEnum.Undefined;

    args = { commitTitle: 'merging the PR...' };

    // ruleResultPullRequestTitle initialisation
    ruleResultPullRequestTitle = new RuleResult(myGitApiInfos);
    ruleResultPullRequestTitle.validated = true;
    ruleResultPullRequestTitle.data = {
      pullRequest: {
        title: 'WIP: webhook',
        number: 22,
        description: 'my desc',
      },
    };
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('mergePullRequest Runnable', () => {
    it('should not call the mergePullRequest Github nor Gitlab service', () => {
      ruleResultPullRequestTitle.gitApiInfos.git = GitTypeEnum.Undefined;
      mergePullRequestRunnable
        .run(CallbackType.Both, ruleResultPullRequestTitle, args)
        .catch(err => logger.error(err));

      expect(githubService.mergePullRequest).not.toBeCalled();
      expect(gitlabService.mergePullRequest).not.toBeCalled();
    });
  });
  describe('mergePullRequest Runnable', () => {
    it('should call the mergePullRequest Githubservice', () => {
      ruleResultPullRequestTitle.gitApiInfos.git = GitTypeEnum.Github;
      mergePullRequestRunnable
        .run(CallbackType.Both, ruleResultPullRequestTitle, args)
        .catch(err => logger.error(err));

      expect(githubService.mergePullRequest).toBeCalled();
      expect(gitlabService.mergePullRequest).not.toBeCalled();
    });
  });
  describe('mergePullRequest Runnable', () => {
    it('should call the mergePullRequest Gitlab service', () => {
      ruleResultPullRequestTitle.gitApiInfos.git = GitTypeEnum.Gitlab;
      mergePullRequestRunnable
        .run(CallbackType.Both, ruleResultPullRequestTitle, args)
        .catch(err => logger.error(err));

      expect(githubService.mergePullRequest).not.toBeCalled();
      expect(gitlabService.mergePullRequest).toBeCalled();
    });
  });
});
