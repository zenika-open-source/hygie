import { Test, TestingModule } from '@nestjs/testing';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { GitTypeEnum } from '../webhook/utils.enum';
import { CallbackType } from './runnables.service';
import { RuleResult } from '../rules/ruleResult';
import { GitApiInfos } from '../git/gitApiInfos';
import {
  MockGitlabService,
  MockGithubService,
  MockAnalytics,
} from '../__mocks__/mocks';
import { UpdatePullRequestRunnable } from '.';

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
      ],
    }).compile();

    githubService = app.get(GithubService);
    gitlabService = app.get(GitlabService);
    updatePullRequestRunnable = app.get(UpdatePullRequestRunnable);

    const myGitApiInfos = new GitApiInfos();
    myGitApiInfos.repositoryFullName = 'bastienterrier/test_webhook';
    myGitApiInfos.git = GitTypeEnum.Undefined;

    args = {
      title: 'Default title',
    };

    // ruleResultPullRequestTitle initialisation
    ruleResultPullRequestTitle = new RuleResult(myGitApiInfos);
    ruleResultPullRequestTitle.validated = false;
    ruleResultPullRequestTitle.data = {
      pullRequestTitle: 'Bad title',
      pullRequestNumber: 22,
      pullRequestDescription: 'my desc',
    };
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('updatePullRequest Runnable', () => {
    it('should not call the updatePullRequest Github nor Gitlab service', () => {
      ruleResultPullRequestTitle.gitApiInfos.git = GitTypeEnum.Undefined;
      updatePullRequestRunnable.run(
        CallbackType.Both,
        ruleResultPullRequestTitle,
        args,
      );

      expect(githubService.updatePullRequest).not.toBeCalled();
      expect(gitlabService.updatePullRequest).not.toBeCalled();
    });
  });
  describe('updatePullRequest Runnable', () => {
    it('should call the updatePullRequest Githubservice', () => {
      ruleResultPullRequestTitle.gitApiInfos.git = GitTypeEnum.Github;
      updatePullRequestRunnable.run(
        CallbackType.Both,
        ruleResultPullRequestTitle,
        args,
      );
      expect(githubService.updatePullRequest).toBeCalled();
      expect(gitlabService.updatePullRequest).not.toBeCalled();
    });
  });
  describe('updatePullRequest Runnable', () => {
    it('should call the updatePullRequest Gitlab service', () => {
      ruleResultPullRequestTitle.gitApiInfos.git = GitTypeEnum.Gitlab;
      updatePullRequestRunnable.run(
        CallbackType.Both,
        ruleResultPullRequestTitle,
        args,
      );
      expect(githubService.updatePullRequest).not.toBeCalled();
      expect(gitlabService.updatePullRequest).toBeCalled();
    });
  });
});
