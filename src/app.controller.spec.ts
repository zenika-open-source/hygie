import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { GitlabService } from './gitlab/gitlab.service';
import { GithubService } from './github/github.service';
import { HttpModule } from '@nestjs/common';
import { Webhook } from './webhook/webhook';
import { GitEventEnum, GitTypeEnum } from './webhook/utils.enum';
import { RulesModule } from './rules/rules.module';
import { WebhookRunnable } from './runnables/webhook.runnable';

describe('AppController', () => {
  let app: TestingModule;
  let githubService: GithubService;
  let gitlabService: GitlabService;
  let appController: AppController;
  let gitlabPushWebhook: Webhook;
  let githubPushWebhook: Webhook;
  let githubBranchWebhook: Webhook;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [HttpModule, RulesModule],
      controllers: [AppController],
      providers: [GithubService, GitlabService, WebhookRunnable],
    }).compile();
    githubService = app.get(GithubService);
    gitlabService = app.get(GitlabService);
    jest
      .spyOn(githubService, 'updateCommitStatus')
      .mockImplementation(() => 'OK');

    jest
      .spyOn(gitlabService, 'updateCommitStatus')
      .mockImplementation(() => 'OK');

    appController = app.get<AppController>(AppController);

    // gitlabPushWebhook initialisation
    gitlabPushWebhook = new Webhook(gitlabService, githubService);
    gitlabPushWebhook.branchName = 'master';
    gitlabPushWebhook.commits = [
      {
        message: 'fix: readme',
        id: '1',
      },
    ];
    gitlabPushWebhook.gitEvent = GitEventEnum.Push;
    gitlabPushWebhook.gitService = gitlabService;
    gitlabPushWebhook.gitType = GitTypeEnum.Gitlab;
    gitlabPushWebhook.projectId = 1;
    gitlabPushWebhook.repository = {
      fullName: 'bastienterrier/test_webhook',
    };

    // githubPushWebhook initialisation
    githubPushWebhook = new Webhook(gitlabService, githubService);
    githubPushWebhook.branchName = 'master';
    githubPushWebhook.commits = [
      {
        message: 'fix: readme',
        id: '1',
      },
    ];
    githubPushWebhook.gitEvent = GitEventEnum.Push;
    githubPushWebhook.gitService = githubService;
    githubPushWebhook.gitType = GitTypeEnum.Github;
    githubPushWebhook.projectId = 1;
    githubPushWebhook.repository = {
      fullName: 'bastienterrier/test_webhook',
    };

    // githubBranchWebhook initialisation
    githubBranchWebhook = new Webhook(gitlabService, githubService);
    githubBranchWebhook.branchName = 'features/fix';
    githubBranchWebhook.commits = [
      {
        message: 'fix: readme',
        id: '1',
      },
    ];
    githubBranchWebhook.gitEvent = GitEventEnum.NewBranch;
    githubBranchWebhook.gitService = githubService;
    githubBranchWebhook.gitType = GitTypeEnum.Github;
    githubBranchWebhook.projectId = 1;
    githubBranchWebhook.repository = {
      fullName: 'bastienterrier/test_webhook',
    };
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('webhook', () => {
    it('should call the Gitlab service', () => {
      appController.processWebhook(gitlabPushWebhook);
      expect(gitlabService.updateCommitStatus).toBeCalled();
      expect(githubService.updateCommitStatus).not.toBeCalled();
    });
  });

  describe('webhook', () => {
    it('should call the Github service', () => {
      appController.processWebhook(githubPushWebhook);
      expect(githubService.updateCommitStatus).toBeCalled();
      expect(gitlabService.updateCommitStatus).not.toBeCalled();
    });
  });

  describe('webhook', () => {
    it('should not call the Github nor Gitlab services', () => {
      appController.processWebhook(githubBranchWebhook);
      expect(githubService.updateCommitStatus).not.toBeCalled();
      expect(gitlabService.updateCommitStatus).not.toBeCalled();
    });
  });
});
