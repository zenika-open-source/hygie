import { Test, TestingModule } from '@nestjs/testing';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { GitTypeEnum } from '../webhook/utils.enum';
import { CallbackType } from './runnables.service';
import { RuleResult } from '../rules/ruleResult';
import { GitApiInfos } from '../git/gitApiInfos';
import { MockGitlabService, MockGithubService } from '../__mocks__/mocks';
import { CommentPullRequestRunnable } from './commentPullRequest.runnable';

describe('RunnableService', () => {
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
      pullRequestTitle: 'WIP: webhook',
      pullRequestNumber: 22,
      pullRequestDescription: 'my desc',
    };
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('commentPullRequest Runnable', () => {
    it('should not call the addPRComment Github nor Gitlab service', () => {
      ruleResultPullRequestTitle.gitApiInfos.git = GitTypeEnum.Undefined;
      commentPullRequestRunnable.run(
        CallbackType.Both,
        ruleResultPullRequestTitle,
        args,
      );

      expect(githubService.addPRComment).not.toBeCalled();
      expect(gitlabService.addPRComment).not.toBeCalled();
    });
  });
  describe('commentPullRequest Runnable', () => {
    it('should call the addPRComment Githubservice', () => {
      ruleResultPullRequestTitle.gitApiInfos.git = GitTypeEnum.Github;
      commentPullRequestRunnable.run(
        CallbackType.Both,
        ruleResultPullRequestTitle,
        args,
      );
      expect(githubService.addPRComment).toBeCalled();
      expect(gitlabService.addPRComment).not.toBeCalled();
    });
  });
  describe('commentPullRequest Runnable', () => {
    it('should call the addPRComment Gitlab service', () => {
      ruleResultPullRequestTitle.gitApiInfos.git = GitTypeEnum.Gitlab;
      commentPullRequestRunnable.run(
        CallbackType.Both,
        ruleResultPullRequestTitle,
        args,
      );
      expect(githubService.addPRComment).not.toBeCalled();
      expect(gitlabService.addPRComment).toBeCalled();
    });
  });
});
