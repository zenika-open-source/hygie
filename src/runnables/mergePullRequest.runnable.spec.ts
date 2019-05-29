import { Test, TestingModule } from '@nestjs/testing';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { GitTypeEnum } from '../webhook/utils.enum';
import { CallbackType } from './runnables.service';
import { RuleResult } from '../rules/ruleResult';
import { GitApiInfos } from '../git/gitApiInfos';
import { MockGitlabService, MockGithubService } from '../__mocks__/mocks';
import { MergePullRequestRunnable } from './mergePullRequest.runnable';

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
      pullRequestTitle: 'WIP: webhook',
      pullRequestNumber: 22,
      pullRequestDescription: 'my desc',
    };
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('mergePullRequest Runnable', () => {
    it('should not call the mergePullRequest Github nor Gitlab service', () => {
      ruleResultPullRequestTitle.gitApiInfos.git = GitTypeEnum.Undefined;
      mergePullRequestRunnable.run(
        CallbackType.Both,
        ruleResultPullRequestTitle,
        args,
      );

      expect(githubService.mergePullRequest).not.toBeCalled();
      expect(gitlabService.mergePullRequest).not.toBeCalled();
    });
  });
  describe('mergePullRequest Runnable', () => {
    it('should call the mergePullRequest Githubservice', () => {
      ruleResultPullRequestTitle.gitApiInfos.git = GitTypeEnum.Github;
      mergePullRequestRunnable.run(
        CallbackType.Both,
        ruleResultPullRequestTitle,
        args,
      );

      expect(githubService.mergePullRequest).toBeCalled();
      expect(gitlabService.mergePullRequest).not.toBeCalled();
    });
  });
  describe('mergePullRequest Runnable', () => {
    it('should call the mergePullRequest Gitlab service', () => {
      ruleResultPullRequestTitle.gitApiInfos.git = GitTypeEnum.Gitlab;
      mergePullRequestRunnable.run(
        CallbackType.Both,
        ruleResultPullRequestTitle,
        args,
      );

      expect(githubService.mergePullRequest).not.toBeCalled();
      expect(gitlabService.mergePullRequest).toBeCalled();
    });
  });
});
