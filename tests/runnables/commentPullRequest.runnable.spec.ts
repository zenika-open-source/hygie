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
import { CommentPullRequestRunnable } from '../../src/runnables/commentPullRequest.runnable';
import { logger } from '../../src/logger/logger.service';
import { EnvVarAccessor } from '../../src/env-var/env-var.accessor';

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

    const myGitApiInfos = new GitApiInfos();
    myGitApiInfos.repositoryFullName = 'bastienterrier/test_webhook';
    myGitApiInfos.git = GitTypeEnum.Undefined;

    args = { comment: 'ping @bastienterrier' };

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
      expect(githubService.addPRComment).toBeCalled();
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
      expect(gitlabService.addPRComment).toBeCalled();
    });
  });
});
