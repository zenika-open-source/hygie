import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/common';
import { MockHttpService, MockObservable } from '../__mocks__/mocks';
import { GitApiInfos } from '../git/gitApiInfos';
import { GitCommitStatusInfos } from '../git/gitCommitStatusInfos';
import { CommitStatusEnum } from '../webhook/utils.enum';
import { GitIssueInfos } from '../git/gitIssueInfos';
import { GitCreatePRInfos, GitCommentPRInfos } from '../git/gitPRInfos';
import { Observable } from 'rxjs';
import { GitlabService } from './gitlab.service';

require('dotenv').config({ path: 'config.env' });

describe('Gitlab Service', () => {
  let app: TestingModule;
  let gitlabService: GitlabService;
  let httpService: HttpService;
  let observable: Observable<any>;

  let gitApiInfos: GitApiInfos;
  let gitCommitStatusInfos: GitCommitStatusInfos;

  const expectedConfig: any = {
    headers: {
      'PRIVATE-TOKEN': process.env.GITLAB_TOKEN,
    },
  };

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        { provide: HttpService, useClass: MockHttpService },
        { provide: Observable, useClass: MockObservable },
        GitlabService,
      ],
    }).compile();

    gitlabService = app.get(GitlabService);
    httpService = app.get(HttpService);
    observable = app.get(Observable);

    gitApiInfos = new GitApiInfos();
    gitApiInfos.projectId = '1';
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

      gitlabService.updateCommitStatus(gitApiInfos, gitCommitStatusInfos);

      const expectedUrl = `${process.env.GITLAB_API}/projects/1/statuses/1`;

      expectedConfig.params = {
        state: 'success',
        target_url: 'https://www.zenika.com',
        description: 'Well done',
      };

      expect(httpService.post).toBeCalledWith(expectedUrl, {}, expectedConfig);
    });
  });
  describe('addIssueComment', () => {
    it('should emit a POST request with specific params', () => {
      const gitIssueInfos = new GitIssueInfos();
      gitIssueInfos.number = '1';
      gitIssueInfos.comment = 'my comment';

      gitlabService.addIssueComment(gitApiInfos, gitIssueInfos);

      const expectedUrl = `${process.env.GITLAB_API}/projects/1/issues/1/notes`;

      expectedConfig.params = {
        body: 'my comment',
      };

      expect(httpService.post).toBeCalledWith(expectedUrl, {}, expectedConfig);
    });
  });

  describe('addPRComment', () => {
    it('should emit a POST request with specific params', () => {
      const gitCommentPRInfos = new GitCommentPRInfos();
      gitCommentPRInfos.number = '1';
      gitCommentPRInfos.comment = 'my comment';

      gitlabService.addPRComment(gitApiInfos, gitCommentPRInfos);

      const expectedUrl = `${
        process.env.GITLAB_API
      }/projects/1/merge_requests/1/notes`;

      expectedConfig.params = {
        body: 'my comment',
      };

      expect(httpService.post).toBeCalledWith(expectedUrl, {}, expectedConfig);
    });
  });

  describe('createPullRequest', () => {
    it('should emit a POST request with specific params', () => {
      const gitCreatePRInfos = new GitCreatePRInfos();
      gitCreatePRInfos.title = 'my PR';
      gitCreatePRInfos.description = 'my desc';
      gitCreatePRInfos.source = 'develop';
      gitCreatePRInfos.target = 'master';

      gitlabService.createPullRequest(gitApiInfos, gitCreatePRInfos);

      const expectedUrl = `${process.env.GITLAB_API}/projects/1/merge_requests`;

      expectedConfig.params = {
        title: 'my PR',
        description: 'my desc',
        source_branch: 'develop',
        target_branch: 'master',
      };

      expect(httpService.post).toBeCalledWith(expectedUrl, {}, expectedConfig);
    });
  });

  describe('setToken', () => {
    it('should set the token', () => {
      gitlabService.setToken('azertyuiop');
      expect(gitlabService.token).toBe('azertyuiop');
    });
  });

  describe('setUrlApi', () => {
    it('should set the url of the API', () => {
      gitlabService.setUrlApi('https://githubapi.com');
      expect(gitlabService.urlApi).toBe('https://githubapi.com');
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

      gitlabService.setEnvironmentVariables('myFilePath');

      expect(gitlabService.token).toBe('qsdfghjklm');
      expect(gitlabService.urlApi).toBe('https://mygitapi.com');
    });
  });
});
