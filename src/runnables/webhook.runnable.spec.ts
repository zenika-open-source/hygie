import { Test, TestingModule } from '@nestjs/testing';
import { HttpService, Logger } from '@nestjs/common';
import { CallbackType } from './runnables.service';
import { RuleResult } from '../rules/ruleResult';
import {
  MockHttpService,
  MockAnalytics,
  MockGitlabService,
  MockGithubService,
} from '../__mocks__/mocks';
import { WebhookRunnable } from './webhook.runnable';
import { EnvVarAccessor } from '../env-var/env-var.accessor';
import { Webhook } from '../webhook/webhook';
import { GitlabService } from '../gitlab/gitlab.service';
import { GithubService } from '../github/github.service';

describe('WebhookRunnable', () => {
  let app: TestingModule;

  let httpService: HttpService;

  let githubService: GithubService;
  let gitlabService: GitlabService;

  let webhookRunnable: WebhookRunnable;

  let args: any;
  let ruleResultCommitMessage: RuleResult;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        WebhookRunnable,
        { provide: GitlabService, useClass: MockGitlabService },
        { provide: GithubService, useClass: MockGithubService },
        { provide: HttpService, useClass: MockHttpService },
        { provide: 'GoogleAnalytics', useValue: MockAnalytics },
        EnvVarAccessor,
      ],
    }).compile();

    githubService = app.get(GithubService);
    gitlabService = app.get(GitlabService);
    httpService = app.get(HttpService);
    webhookRunnable = app.get(WebhookRunnable);

    const webhook = new Webhook(gitlabService, githubService);
    webhook.branchName = 'test_webhook';

    args = {
      url: 'https://webhook.site/abcdef',
      data: {
        user: 'my name',
        content: 'my content',
        branch: '{{data.branchName}}',
      },
    };

    // ruleResultBranchName initialisation
    ruleResultCommitMessage = new RuleResult(webhook);
    ruleResultCommitMessage.validated = true;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('webhook Runnable', () => {
    it('should send a post request with specific url and data ', () => {
      webhookRunnable
        .run(CallbackType.Both, ruleResultCommitMessage, args)
        .catch(err => Logger.error(err));

      expect(httpService.post).toBeCalledWith(
        'https://webhook.site/abcdef',
        JSON.stringify({
          user: 'my name',
          content: 'my content',
          branch: 'test_webhook',
        }),
        {},
      );
    });
  });
});
