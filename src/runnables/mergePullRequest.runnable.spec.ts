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
import { MergePullRequestRunnable } from './mergePullRequest.runnable';
import { logger } from '../logger/logger.service';
import { EnvVarAccessor } from '../env-var/env-var.accessor';
import { Webhook } from '../webhook/webhook';

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

    const webhook = new Webhook(gitlabService, githubService);
    webhook.pullRequest.title = 'WIP: webhook';
    webhook.pullRequest.number = 22;
    webhook.pullRequest.description = 'my desc';

    args = { commitTitle: 'merging the PR...' };

    // ruleResultPullRequestTitle initialisation
    ruleResultPullRequestTitle = new RuleResult(webhook);
    ruleResultPullRequestTitle.validated = true;
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

      expect(githubService.mergePullRequest).toBeCalledWith({
        commitTitle: 'merging the PR...',
        method: 'Merge',
        number: 22,
      });
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
      expect(gitlabService.mergePullRequest).toBeCalledWith({
        commitTitle: 'merging the PR...',
        method: 'Merge',
        number: 22,
      });
    });
  });
});
