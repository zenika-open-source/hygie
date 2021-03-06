import { Test, TestingModule } from '@nestjs/testing';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { GitTypeEnum } from '../webhook/utils.enum';
import { CallbackType } from './runnables.service';
import { RuleResult } from '../rules/ruleResult';
import { MockGitlabService, MockGithubService } from '../__mocks__/mocks';
import { CommentIssueRunnable } from './commentIssue.runnable';
import { EnvVarAccessor } from '../env-var/env-var.accessor';
import { Webhook } from '../webhook/webhook';
import { Logger } from '@nestjs/common';

jest.mock('../analytics/analytics.decorator');

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
        EnvVarAccessor,
      ],
    }).compile();

    githubService = app.get(GithubService);
    gitlabService = app.get(GitlabService);
    commentIssueRunnable = app.get(CommentIssueRunnable);

    const webhook = new Webhook(gitlabService, githubService);
    webhook.issue.number = 22;

    args = { comment: 'ping @bastienterrier' };

    // ruleResultIssueTitle initialisation
    ruleResultIssueTitle = new RuleResult(webhook);
    ruleResultIssueTitle.validated = true;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('commentIssue Runnable', () => {
    it('should not call the addIssueComment Github nor Gitlab service', () => {
      commentIssueRunnable
        .run(CallbackType.Both, ruleResultIssueTitle, args)
        .catch(err => Logger.error(err));
      expect(githubService.addIssueComment).not.toBeCalled();
      expect(gitlabService.addIssueComment).not.toBeCalled();
    });
  });
  describe('commentIssue Runnable', () => {
    it('should call the addIssueComment Github service', () => {
      ruleResultIssueTitle.gitApiInfos.git = GitTypeEnum.Github;
      commentIssueRunnable
        .run(CallbackType.Both, ruleResultIssueTitle, args)
        .catch(err => Logger.error(err));

      expect(githubService.addIssueComment).toBeCalledWith({
        comment: 'ping @bastienterrier',
        number: 22,
      });
      expect(gitlabService.addIssueComment).not.toBeCalled();
    });
  });
  describe('commentIssue Runnable', () => {
    it('should call the addIssueComment Gitlab service', () => {
      ruleResultIssueTitle.gitApiInfos.git = GitTypeEnum.Gitlab;
      commentIssueRunnable
        .run(CallbackType.Both, ruleResultIssueTitle, args)
        .catch(err => Logger.error(err));

      expect(githubService.addIssueComment).not.toBeCalled();
      expect(gitlabService.addIssueComment).toBeCalledWith({
        comment: 'ping @bastienterrier',
        number: 22,
      });
    });
  });
});
