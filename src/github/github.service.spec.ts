import { Test, TestingModule } from '@nestjs/testing';
import { GithubService } from '../github/github.service';
import { HttpService } from '@nestjs/common';
import { MockHttpService, MockObservable } from '../__mocks__/mocks';
import { GitApiInfos } from '../git/gitApiInfos';
import { GitCommitStatusInfos } from '../git/gitCommitStatusInfos';
import { CommitStatusEnum } from '../webhook/utils.enum';
import { GitIssueInfos } from '../git/gitIssueInfos';
import { GitCreatePRInfos, GitCommentPRInfos } from '../git/gitPRInfos';
import { Observable } from 'rxjs';

describe('Github Service', () => {
  let app: TestingModule;
  let githubService: GithubService;
  let httpService: HttpService;
  let observable: Observable<any>;

  let gitApiInfos: GitApiInfos;
  let gitCommitStatusInfos: GitCommitStatusInfos;

  let expectedConfig;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        { provide: HttpService, useClass: MockHttpService },
        { provide: Observable, useClass: MockObservable },
        GithubService,
      ],
    }).compile();

    githubService = app.get(GithubService);
    httpService = app.get(HttpService);
    observable = app.get(Observable);

    githubService.setToken('0123456789abcdef');
    githubService.setUrlApi('https://api.github.com');
    githubService.setConfigGitHub({
      headers: {
        Authorization: `token 0123456789abcdef`,
      },
    });

    gitApiInfos = new GitApiInfos();
    gitApiInfos.repositoryFullName = 'bastienterrier/test';

    expectedConfig = {
      headers: {
        Authorization: `token 0123456789abcdef`,
      },
    };
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('updateCommitStatus', () => {
    it('should emit a POST request with specific params', () => {
      gitCommitStatusInfos = new GitCommitStatusInfos();
      gitCommitStatusInfos.commitSha = '1';
      gitCommitStatusInfos.commitStatus = CommitStatusEnum.Success;
      gitCommitStatusInfos.descriptionMessage = 'Well done';
      gitCommitStatusInfos.targetUrl = 'https://www.zenika.com';

      githubService.updateCommitStatus(gitApiInfos, gitCommitStatusInfos);

      const expectedUrl = `https://api.github.com/repos/bastienterrier/test/statuses/1`;

      const expectedData = {
        state: 'success',
        target_url: 'https://www.zenika.com',
        description: 'Well done',
      };

      expect(httpService.post).toBeCalledWith(
        expectedUrl,
        expectedData,
        expectedConfig,
      );
    });
  });

  describe('addIssueComment', () => {
    it('should emit a POST request with specific params', () => {
      const gitIssueInfos = new GitIssueInfos();
      gitIssueInfos.number = '1';
      gitIssueInfos.comment = 'my comment';

      githubService.addIssueComment(gitApiInfos, gitIssueInfos);

      const expectedUrl = `https://api.github.com/repos/bastienterrier/test/issues/1/comments`;

      const expectedData = {
        body: 'my comment',
      };

      expect(httpService.post).toBeCalledWith(
        expectedUrl,
        expectedData,
        expectedConfig,
      );
    });
  });

  describe('addPRComment', () => {
    it('should emit a POST request with specific params', () => {
      const gitCommentPRInfos = new GitCommentPRInfos();
      gitCommentPRInfos.number = '1';
      gitCommentPRInfos.comment = 'my comment';

      githubService.addPRComment(gitApiInfos, gitCommentPRInfos);

      const expectedUrl = `https://api.github.com/repos/bastienterrier/test/issues/1/comments`;

      const expectedData = {
        body: 'my comment',
      };

      expect(httpService.post).toBeCalledWith(
        expectedUrl,
        expectedData,
        expectedConfig,
      );
    });
  });

  describe('createPullRequest', () => {
    it('should emit a POST request with specific params', () => {
      const gitCreatePRInfos = new GitCreatePRInfos();
      gitCreatePRInfos.title = 'my PR';
      gitCreatePRInfos.description = 'my desc';
      gitCreatePRInfos.source = 'develop';
      gitCreatePRInfos.target = 'master';

      githubService.createPullRequest(gitApiInfos, gitCreatePRInfos);

      const expectedUrl = `https://api.github.com/repos/bastienterrier/test/pulls`;

      const expectedData = {
        title: 'my PR',
        body: 'my desc',
        head: 'develop',
        base: 'master',
      };

      expect(httpService.post).toBeCalledWith(
        expectedUrl,
        expectedData,
        expectedConfig,
      );

      // expect(observable.subscribe).toBeCalled();
    });
  });

  describe('setToken', () => {
    it('should set the token', () => {
      githubService.setToken('azertyuiop');
      expect(githubService.token).toBe('azertyuiop');
    });
  });

  describe('setUrlApi', () => {
    it('should set the url of the API', () => {
      githubService.setUrlApi('https://githubapi.com');
      expect(githubService.urlApi).toBe('https://githubapi.com');
    });
  });

  describe('setConfigGitHub', () => {
    it('should set the config header', () => {
      githubService.setConfigGitHub({
        headers: {
          Authorization: 'token azertyuiop',
        },
      });
      expect(githubService.configGitHub).toEqual({
        headers: {
          Authorization: 'token azertyuiop',
        },
      });
    });
  });

  describe('setEnvironmentVariables', () => {
    it('should set the token and urlApi', () => {
      const fs = require('fs');
      jest.mock('fs');

      fs.readFileSync.mockReturnValue(
        `gitApi=https://mygitapi.com
      gitToken=qsdfghjklm`,
      );

      githubService.setEnvironmentVariables('myFilePath');

      expect(githubService.token).toBe('qsdfghjklm');
      expect(githubService.urlApi).toBe('https://mygitapi.com');
    });
  });
});
