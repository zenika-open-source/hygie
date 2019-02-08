import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GitlabService } from './gitlab/gitlab.service';
import { GithubService } from './github/github.service';
import { HttpModule } from '@nestjs/common';
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
      appController.processWebhook({
        commits: [{ message: 'message', id: '1' }],
        project_id: 1,
        ref: 'ref/header/master',
        before: 'f8e6eb8d6a9e8f07fd66df108e78eae7225bd7c2',
      });
      expect(gitlabService.updateCommitStatus).toBeCalled();
    });
  });

  describe('webhook', () => {
    it('should call the Github service', () => {
      appController.processWebhook({
        commits: [{ message: 'message', id: '1' }],
        repository: {
          full_name: 'oto',
        },
      });
      expect(githubService.updateCommitStatus).toBeCalled();
    });
  });

  describe('webhook', () => {
    it('should not call the Github nor Gitlab services', () => {
      appController.processWebhook({
        ref: 'features/tests',
        ref_type: 'branch',
      });
      expect(githubService.updateCommitStatus).not.toBeCalled();
      expect(gitlabService.updateCommitStatus).not.toBeCalled();
    });
  });
});
