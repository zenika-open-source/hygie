import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/common';
import { GitTypeEnum } from '../../src/webhook/utils.enum';
import { CallbackType } from '../../src/runnables/runnables.service';
import { RuleResult } from '../../src/rules/ruleResult';
import { GitApiInfos } from '../../src/git/gitApiInfos';
import { MockHttpService, MockAnalytics } from '../../src/__mocks__/mocks';
import { WebhookRunnable } from '../../src/runnables/webhook.runnable';
import { logger } from '../../src/logger/logger.service';
import { EnvVarAccessor } from '../../src/env-var/env-var.accessor';

describe('WebhookRunnable', () => {
  let app: TestingModule;

  let httpService: HttpService;

  let webhookRunnable: WebhookRunnable;

  let args: any;
  let ruleResultCommitMessage: RuleResult;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        WebhookRunnable,
        { provide: HttpService, useClass: MockHttpService },
        { provide: 'GoogleAnalytics', useValue: MockAnalytics },
        EnvVarAccessor,
      ],
    }).compile();

    httpService = app.get(HttpService);
    webhookRunnable = app.get(WebhookRunnable);

    const myGitApiInfos = new GitApiInfos();
    myGitApiInfos.repositoryFullName = 'bastienterrier/test_webhook';
    myGitApiInfos.git = GitTypeEnum.Undefined;

    args = {
      url: 'https://webhook.site/abcdef',
      data: {
        user: 'my name',
        content: 'my content',
      },
    };

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
      webhookRunnable
        .run(CallbackType.Both, ruleResultCommitMessage, args)
        .catch(err => logger.error(err));

      expect(httpService.post).toBeCalledWith(
        'https://webhook.site/abcdef',
        JSON.stringify({
          user: 'my name',
          content: 'my content',
        }),
        {},
      );
    });
  });
});
