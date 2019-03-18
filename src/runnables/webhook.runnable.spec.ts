import { Test, TestingModule } from '@nestjs/testing';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { Webhook } from '../webhook/webhook';
import { HttpService } from '@nestjs/common';
import { GitTypeEnum } from '../webhook/utils.enum';
import { RunnablesService } from './runnables.service';
import { RuleResult } from '../rules/ruleResult';
import { GitApiInfos } from '../git/gitApiInfos';
import {
  MockHttpService,
  MockGitlabService,
  MockGithubService,
} from '../__mocks__/mocks';
import { CommitMessageRule } from '../rules';

describe('RunnableService', () => {
  let app: TestingModule;

  let githubService: GithubService;
  let gitlabService: GitlabService;
  let httpService: HttpService;

  let runnableService: RunnablesService;

  let commitMessageRule: CommitMessageRule;
  let ruleResultCommitMessage: RuleResult;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        RunnablesService,
        { provide: HttpService, useClass: MockHttpService },
        { provide: GitlabService, useClass: MockGitlabService },
        { provide: GithubService, useClass: MockGithubService },
      ],
    }).compile();

    githubService = app.get(GithubService);
    gitlabService = app.get(GitlabService);
    httpService = app.get(HttpService);
    runnableService = app.get(RunnablesService);

    const myGitApiInfos = new GitApiInfos();
    myGitApiInfos.repositoryFullName = 'bastienterrier/test_webhook';
    myGitApiInfos.git = GitTypeEnum.Undefined;

    // branchNameRule initialisation
    commitMessageRule = new CommitMessageRule();
    commitMessageRule.onBoth = [
      {
        callback: 'WebhookRunnable',
        args: {
          url: 'https://webhook.site/abcdef',
          data: {
            user: 'my name',
            content: 'my content',
          },
        },
      },
    ];

    // ruleResultBranchName initialisation
    ruleResultCommitMessage = new RuleResult(myGitApiInfos);
    ruleResultCommitMessage.validated = true;
    ruleResultCommitMessage.data = {
      branch: 'test_webhook',
      commits: [
        {
          status: 'Success',
          success: true,
          sha: '1',
          message: 'fix: readme (#12)',
          matches: ['fix: readme (#12)', 'fix', null, '(#12)'],
        },
      ],
    };
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('webhook Runnable', () => {
    it('should send a post request with specific url and data ', () => {
      ruleResultCommitMessage.gitApiInfos.git = GitTypeEnum.Undefined;
      runnableService.executeRunnableFunctions(
        ruleResultCommitMessage,
        commitMessageRule,
      );
      expect(httpService.post).toBeCalledWith(
        'https://webhook.site/abcdef',
        JSON.stringify({
          user: 'my name',
          content: 'my content',
        }),
        JSON.stringify({}),
      );
    });
  });
});
