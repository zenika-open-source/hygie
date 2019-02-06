import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GitlabService } from './gitlab/gitlab.service';
import { GithubService } from './github/github.service';
import { HttpService } from '@nestjs/common';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, GitlabService, GithubService, HttpService],
    }).compile();
  });

  describe('getHello', () => {
    it('should return "Hello World!"', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  describe('webhook', () => {
    it('should call the Gitlab service', () => {
      const gitlabService = app.get(GitlabService);
      const appController = app.get<AppController>(AppController);
      jest
        .spyOn(gitlabService, 'updateCommitStatus')
        .mockImplementation(() => 'OK');

      appController.processWebhook({}, { webhook: {} });
      expect(gitlabService.updateCommitStatus).toBeCalled();
    });
  });
});
