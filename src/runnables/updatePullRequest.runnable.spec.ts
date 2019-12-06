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
import { UpdatePullRequestRunnable } from '.';
import { logger } from '../logger/logger.service';
import { EnvVarAccessor } from '../env-var/env-var.accessor';
import { Webhook } from '../webhook/webhook';

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

    const webhook = new Webhook(gitlabService, githubService);
    webhook.pullRequest.title = 'Bad title';
    webhook.pullRequest.number = 22;
    webhook.pullRequest.description = 'my desc';

    args = {
      title: 'Default title',
    };

    // ruleResultPullRequestTitle initialisation
    ruleResultPullRequestTitle = new RuleResult(webhook);
    ruleResultPullRequestTitle.validated = false;
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
      expect(githubService.updatePullRequest).toBeCalledWith({number: 22, title: 'Default title'});
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
      expect(gitlabService.updatePullRequest).toBeCalledWith({number: 22, title: 'Default title'});
    });
  });
});
