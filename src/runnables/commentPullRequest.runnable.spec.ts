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
import { CommentPullRequestRunnable } from './commentPullRequest.runnable';
import { logger } from '../logger/logger.service';
import { EnvVarAccessor } from '../env-var/env-var.accessor';
import { Webhook } from '../webhook/webhook';

describe('CommentPullRequestRunnable', () => {
  let app: TestingModule;

  let githubService: GithubService;
  let gitlabService: GitlabService;

  let commentPullRequestRunnable: CommentPullRequestRunnable;

  let args: any;
  let ruleResultPullRequestTitle: RuleResult;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        CommentPullRequestRunnable,
        { provide: GitlabService, useClass: MockGitlabService },
        { provide: GithubService, useClass: MockGithubService },
        { provide: 'GoogleAnalytics', useValue: MockAnalytics },
        EnvVarAccessor,
      ],
    }).compile();

    githubService = app.get(GithubService);
    gitlabService = app.get(GitlabService);
    commentPullRequestRunnable = app.get(CommentPullRequestRunnable);

    args = { comment: 'ping @bastienterrier' };

    const webhook = new Webhook(gitlabService, githubService);
    webhook.pullRequest.number = 22;

    // ruleResultPullRequestTitle initialisation
    ruleResultPullRequestTitle = new RuleResult(webhook);
    ruleResultPullRequestTitle.validated = true;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('commentPullRequest Runnable', () => {
    it('should not call the addPRComment Github nor Gitlab service', () => {
      ruleResultPullRequestTitle.gitApiInfos.git = GitTypeEnum.Undefined;
      commentPullRequestRunnable
        .run(CallbackType.Both, ruleResultPullRequestTitle, args)
        .catch(err => logger.error(err));

      expect(githubService.addPRComment).not.toBeCalled();
      expect(gitlabService.addPRComment).not.toBeCalled();
    });
  });
  describe('commentPullRequest Runnable', () => {
    it('should call the addPRComment Githubservice', () => {
      ruleResultPullRequestTitle.gitApiInfos.git = GitTypeEnum.Github;
      commentPullRequestRunnable
        .run(CallbackType.Both, ruleResultPullRequestTitle, args)
        .catch(err => logger.error(err));
      expect(githubService.addPRComment).toBeCalledWith({
        comment: 'ping @bastienterrier',
        number: 22,
      });
      expect(gitlabService.addPRComment).not.toBeCalled();
    });
  });
  describe('commentPullRequest Runnable', () => {
    it('should call the addPRComment Gitlab service', () => {
      ruleResultPullRequestTitle.gitApiInfos.git = GitTypeEnum.Gitlab;
      commentPullRequestRunnable
        .run(CallbackType.Both, ruleResultPullRequestTitle, args)
        .catch(err => logger.error(err));
      expect(githubService.addPRComment).not.toBeCalled();
      expect(gitlabService.addPRComment).toBeCalledWith({
        comment: 'ping @bastienterrier',
        number: 22,
      });
    });
  });
});
