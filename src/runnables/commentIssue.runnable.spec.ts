import { Test, TestingModule } from '@nestjs/testing';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { GitTypeEnum } from '../webhook/utils.enum';
import { CallbackType } from './runnables.service';
import { RuleResult } from '../rules/ruleResult';
import { GitApiInfos } from '../git/gitApiInfos';
import { MockGitlabService, MockGithubService } from '../__mocks__/mocks';
import { CommentIssueRunnable } from './commentIssue.runnable';

describe('RunnableService', () => {
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
      issueNumber: 22,
    };
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('commentIssue Runnable', () => {
    it('should not call the addIssueComment Github nor Gitlab service', () => {
      commentIssueRunnable.run(CallbackType.Both, ruleResultIssueTitle, args);
      expect(githubService.addIssueComment).not.toBeCalled();
      expect(gitlabService.addIssueComment).not.toBeCalled();
    });
  });
  describe('commentIssue Runnable', () => {
    it('should call the addIssueComment Github service', () => {
      ruleResultIssueTitle.gitApiInfos.git = GitTypeEnum.Github;
      commentIssueRunnable.run(CallbackType.Both, ruleResultIssueTitle, args);

      expect(githubService.addIssueComment).toBeCalled();
      expect(gitlabService.addIssueComment).not.toBeCalled();
    });
  });
  describe('commentIssue Runnable', () => {
    it('should call the addIssueComment Gitlab service', () => {
      ruleResultIssueTitle.gitApiInfos.git = GitTypeEnum.Gitlab;
      commentIssueRunnable.run(CallbackType.Both, ruleResultIssueTitle, args);

      expect(githubService.addIssueComment).not.toBeCalled();
      expect(gitlabService.addIssueComment).toBeCalled();
    });
  });
});
