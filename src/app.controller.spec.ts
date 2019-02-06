import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GitlabService } from './gitlab/gitlab.service';
import { GithubService } from './github/github.service';
import { HttpService, HttpModule } from '@nestjs/common';
import { GitServiceInterface } from './interfaces/git.service.interface';

describe('AppController', () => {
  let app: TestingModule;
  let githubService: GitServiceInterface;
  let gitlabService: GitServiceInterface;
  let appController: AppController;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [AppController],
      providers: [AppService, GitlabService, GithubService],
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
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getHello', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  describe('webhook', () => {
    it('should call the Gitlab service', () => {
      appController.processWebhook(
        {
          headers: {
            'x-gitlab-event': 'commit',
          },
        },
        {
          commits: [{ message: 'message', id: '1' }],
          project_id: 1,
        },
      );
      expect(gitlabService.updateCommitStatus).toBeCalled();
    });
  });

  describe('webhook', () => {
    it('should call the Github service', () => {
      appController.processWebhook(
        {
          headers: {
            'x-github-event': 'commit',
          },
        },
        {
          commits: [{ message: 'message', id: '1' }],
          repository: {
            full_name: 'oto',
          },
        },
      );
      expect(githubService.updateCommitStatus).toBeCalled();
    });
  });

  describe('webhook', () => {
    it('should not call the Github nor Gitlab services', () => {
      appController.processWebhook(
        {
          headers: {
            'x-nothing-event': 'commit',
          },
        },
        {
          commits: [{ message: 'fix: message', id: '666' }],
          repository: {
            full_name: 'tot',
          },
        },
      );
      expect(githubService.updateCommitStatus).not.toBeCalled();
      expect(gitlabService.updateCommitStatus).not.toBeCalled();
    });
  });
});
