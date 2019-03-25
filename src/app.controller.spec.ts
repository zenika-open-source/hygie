import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { GitlabService } from './gitlab/gitlab.service';
import { GithubService } from './github/github.service';
import { HttpModule, HttpService } from '@nestjs/common';
import { Webhook } from './webhook/webhook';
import { GitEventEnum, GitTypeEnum } from './webhook/utils.enum';
import { RulesModule } from './rules/rules.module';
import {
  MockGitlabService,
  MockGithubService,
  MockHttpService,
} from './__mocks__/mocks';
import { RunnableModule } from './runnables/runnable.module';

describe('AppController', () => {
  let app: TestingModule;
  let githubService: GithubService;
  let gitlabService: GitlabService;
  let appController: AppController;
  let gitlabPushWebhook: Webhook;
  let githubPushWebhook: Webhook;
  let githubBranchWebhook: Webhook;

  const res = {
    status: () => ({ send: () => this }),
  };

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [RulesModule, RunnableModule],
      controllers: [AppController],
      providers: [
        { provide: HttpService, useClass: MockHttpService },
        { provide: GitlabService, useClass: MockGitlabService },
        { provide: GithubService, useClass: MockGithubService },
      ],
    }).compile();

    githubService = app.get(GithubService);
    gitlabService = app.get(GitlabService);
    appController = app.get<AppController>(AppController);

    githubService.updateCommitStatus = jest.fn();
    gitlabService.updateCommitStatus = jest.fn();

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
      name: 'test_webhook',
      description: 'amazing project',
      cloneURL: 'https://github.com/bastienterrier/test-webhook.git',
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
      name: 'test_webhook',
      description: 'amazing project',
      cloneURL: 'https://github.com/bastienterrier/test-webhook.git',
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
      name: 'test_webhook',
      description: 'amazing project',
      cloneURL: 'https://github.com/bastienterrier/test-webhook.git',
    };
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('webhook', () => {
    it('should call the updateCommitStatus Gitlab service', () => {
      appController.processWebhook(gitlabPushWebhook, res);
      expect(gitlabService.updateCommitStatus).toBeCalled();
      expect(githubService.updateCommitStatus).not.toBeCalled();
    });
  });

  describe('webhook', () => {
    it('should call the updateCommitStatus Github service', () => {
      appController.processWebhook(githubPushWebhook, res);
      expect(githubService.updateCommitStatus).toBeCalled();
      expect(gitlabService.updateCommitStatus).not.toBeCalled();
    });
  });

  describe('webhook', () => {
    it('should not call the updateCommitStatus Github nor updateCommitStatus Gitlab services', () => {
      appController.processWebhook(githubBranchWebhook, res);
      expect(githubService.updateCommitStatus).not.toBeCalled();
      expect(gitlabService.updateCommitStatus).not.toBeCalled();
    });
  });
});
