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
import { CommentIssueRunnable } from '../../src/runnables/commentIssue.runnable';
import { logger } from '../../src/logger/logger.service';
import { EnvVarAccessor } from '../../src/env-var/env-var.accessor';

describe('CommentIssueRunnable', () => {
  let app: TestingModule;

  let githubService: GithubService;
  let gitlabService: GitlabService;

  let commentIssueRunnable: CommentIssueRunnable;

  let args: any;
  let ruleResultIssueTitle: RuleResult;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        CommentIssueRunnable,
        { provide: GitlabService, useClass: MockGitlabService },
        { provide: GithubService, useClass: MockGithubService },
        { provide: 'GoogleAnalytics', useValue: MockAnalytics },
        EnvVarAccessor,
      ],
    }).compile();

    githubService = app.get(GithubService);
    gitlabService = app.get(GitlabService);
    commentIssueRunnable = app.get(CommentIssueRunnable);

    const myGitApiInfos = new GitApiInfos();
    myGitApiInfos.repositoryFullName = 'bastienterrier/test_webhook';
    myGitApiInfos.git = GitTypeEnum.Undefined;

    args = { comment: 'ping @bastienterrier' };

    // ruleResultIssueTitle initialisation
    ruleResultIssueTitle = new RuleResult(myGitApiInfos);
    ruleResultIssueTitle.validated = true;
    ruleResultIssueTitle.data = {
      issue: { number: 22 },
    };
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('commentIssue Runnable', () => {
    it('should not call the addIssueComment Github nor Gitlab service', () => {
      commentIssueRunnable
        .run(CallbackType.Both, ruleResultIssueTitle, args)
        .catch(err => logger.error(err));
      expect(githubService.addIssueComment).not.toBeCalled();
      expect(gitlabService.addIssueComment).not.toBeCalled();
    });
  });
  describe('commentIssue Runnable', () => {
    it('should call the addIssueComment Github service', () => {
      ruleResultIssueTitle.gitApiInfos.git = GitTypeEnum.Github;
      commentIssueRunnable
        .run(CallbackType.Both, ruleResultIssueTitle, args)
        .catch(err => logger.error(err));

      expect(githubService.addIssueComment).toBeCalled();
      expect(gitlabService.addIssueComment).not.toBeCalled();
    });
  });
  describe('commentIssue Runnable', () => {
    it('should call the addIssueComment Gitlab service', () => {
      ruleResultIssueTitle.gitApiInfos.git = GitTypeEnum.Gitlab;
      commentIssueRunnable
        .run(CallbackType.Both, ruleResultIssueTitle, args)
        .catch(err => logger.error(err));

      expect(githubService.addIssueComment).not.toBeCalled();
      expect(gitlabService.addIssueComment).toBeCalled();
    });
  });
});
