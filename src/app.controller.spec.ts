import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GitlabService } from './gitlab/gitlab.service';
import { GithubService } from './github/github.service';
import { HttpService, HttpModule } from '@nestjs/common';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [AppController],
      providers: [AppService, GitlabService, GithubService],
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

      appController.processWebhook(
        {
          headers: {
            'x-gitlab-event': 'commit',
          },
        },
        {
          commits: [{ message: 'message', id: '1' }],
        },
      );
      expect(gitlabService.updateCommitStatus).toBeCalled();
    });
  });
});
