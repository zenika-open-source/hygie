import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/common';
import {
  MockHttpService,
  MockObservable,
  MockDataAccessService,
} from '../__mocks__/mocks';
import { GitApiInfos } from '../git/gitApiInfos';
import { GitCommitStatusInfos } from '../git/gitCommitStatusInfos';
import { CommitStatusEnum } from '../webhook/utils.enum';
import {
  GitIssueInfos,
  IssuePRStateEnum,
  GitIssuePRSearch,
  IssueSortEnum,
} from '../git/gitIssueInfos';
import {
  GitPRInfos,
  GitCommentPRInfos,
  GitMergePRInfos,
  PRMethodsEnum,
} from '../git/gitPRInfos';
import { Observable } from 'rxjs';
import { GitlabService } from './gitlab.service';
import { GitFileInfos } from '../git/gitFileInfos';
import { DataAccessService } from '../data_access/dataAccess.service';
import { GitRelease } from '../git/gitRelease';
import { GitTag } from '../git/gitTag';

describe('Gitlab Service', () => {
  let app: TestingModule;
  let gitlabService: GitlabService;
  let httpService: HttpService;
  let observable: Observable<any>;
  let dataAccessService: DataAccessService;

  let gitApiInfos: GitApiInfos;
  let gitCommitStatusInfos: GitCommitStatusInfos;

  let expectedConfig: any = {};

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        { provide: HttpService, useClass: MockHttpService },
        { provide: Observable, useClass: MockObservable },
        { provide: DataAccessService, useClass: MockDataAccessService },

        GitlabService,
      ],
    }).compile();

    gitlabService = app.get(GitlabService);
    httpService = app.get(HttpService);
    observable = app.get(Observable);
    dataAccessService = app.get(DataAccessService);

    gitApiInfos = new GitApiInfos();
    gitApiInfos.projectId = '1';

    gitlabService.setToken('0123456789abcdef');
    gitlabService.setUrlApi('https://gitlab.com/api/v4');

    expectedConfig = {
      headers: {
        'PRIVATE-TOKEN': gitlabService.token,
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

      gitlabService.updateCommitStatus(gitApiInfos, gitCommitStatusInfos);

      const expectedUrl = `${gitlabService.urlApi}/projects/1/statuses/1`;

      expectedConfig.params = {
        context: process.env.APPLICATION_NAME,
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

      const expectedUrl = `${gitlabService.urlApi}/projects/1/issues/1/notes`;

      expectedConfig.params = {
        body: 'my comment',
      };

      expect(httpService.post).toBeCalledWith(expectedUrl, {}, expectedConfig);
    });
  });

  describe('updateIssue', () => {
    it('should emit a PUT request with specific params', () => {
      const gitIssueInfos = new GitIssueInfos();
      gitIssueInfos.number = '1';
      gitIssueInfos.state = IssuePRStateEnum.Close;

      gitlabService.updateIssue(gitApiInfos, gitIssueInfos);

      const expectedUrl = `${gitlabService.urlApi}/projects/1/issues/1`;

      expectedConfig.params = {
        state_event: 'close',
      };

      expect(httpService.put).toBeCalledWith(expectedUrl, {}, expectedConfig);
    });

    it('should emit a PUT request with specific params', () => {
      const gitIssueInfos = new GitIssueInfos();
      gitIssueInfos.number = '1';
      gitIssueInfos.state = IssuePRStateEnum.Open;

      gitlabService.updateIssue(gitApiInfos, gitIssueInfos);

      const expectedUrl = `${gitlabService.urlApi}/projects/1/issues/1`;

      expectedConfig.params = {
        state_event: 'reopen',
      };

      expect(httpService.put).toBeCalledWith(expectedUrl, {}, expectedConfig);
    });
  });

  describe('addPRComment', () => {
    it('should emit a POST request with specific params', () => {
      const gitCommentPRInfos = new GitCommentPRInfos();
      gitCommentPRInfos.number = '1';
      gitCommentPRInfos.comment = 'my comment';

      gitlabService.addPRComment(gitApiInfos, gitCommentPRInfos);

      const expectedUrl = `${
        gitlabService.urlApi
      }/projects/1/merge_requests/1/notes`;

      expectedConfig.params = {
        body: 'my comment',
      };

      expect(httpService.post).toBeCalledWith(expectedUrl, {}, expectedConfig);
    });
  });

  describe('createPullRequest', () => {
    it('should emit a POST request with specific params', () => {
      const gitCreatePRInfos = new GitPRInfos();
      gitCreatePRInfos.title = 'my PR';
      gitCreatePRInfos.description = 'my desc';
      gitCreatePRInfos.source = 'develop';
      gitCreatePRInfos.target = 'master';

      gitlabService.createPullRequest(gitApiInfos, gitCreatePRInfos);

      const expectedUrl = `${gitlabService.urlApi}/projects/1/merge_requests`;

      expectedConfig.params = {
        title: 'my PR',
        description: 'my desc',
        source_branch: 'develop',
        target_branch: 'master',
      };

      expect(httpService.post).toBeCalledWith(expectedUrl, {}, expectedConfig);
    });
  });

  describe('createIssue', () => {
    it('should emit a POST request with specific params', () => {
      const gitIssueInfos = new GitIssueInfos();
      gitIssueInfos.title = 'my new issue';
      gitIssueInfos.description = 'my desc';
      gitIssueInfos.labels = ['good first issue', 'rules'];

      gitlabService.createIssue(gitApiInfos, gitIssueInfos);

      const expectedUrl = `${gitlabService.urlApi}/projects/1/issues`;

      expectedConfig.params = {
        title: 'my new issue',
        description: 'my desc',
        labels: 'good first issue,rules',
      };

      expect(httpService.post).toBeCalledWith(expectedUrl, {}, expectedConfig);
    });
  });

  describe('deleteBranch', () => {
    it('should emit a DELETE request with specific params', () => {
      gitlabService.deleteBranch(gitApiInfos, 'feature/test');

      const expectedUrl = `${
        gitlabService.urlApi
      }/projects/1/repository/branches/feature%2Ftest`;

      expect(httpService.delete).toBeCalledWith(expectedUrl, {
        headers: expectedConfig.headers,
      });
    });
  });

  describe('deleteFile', () => {
    it('should emit a DELETE request with specific params', () => {
      const gitFileInfos = new GitFileInfos();
      gitFileInfos.fileBranch = 'master';
      gitFileInfos.filePath = 'file/to/delete.txt';
      gitFileInfos.commitMessage = 'delete file';
      gitlabService.deleteFile(gitApiInfos, gitFileInfos);

      const expectedUrl = `${
        gitlabService.urlApi
      }/projects/1/repository/files/file%2Fto%2Fdelete.txt`;

      expectedConfig.params = {
        branch: 'master',
        commit_message: 'delete file',
      };

      expect(httpService.delete).toBeCalledWith(expectedUrl, expectedConfig);
    });
  });

  describe('mergePullRequest', () => {
    it('should emit a PUT request with specific params', () => {
      const gitMergePRInfos = new GitMergePRInfos();
      gitMergePRInfos.number = 42;
      gitMergePRInfos.commitTitle = 'commit title';
      gitMergePRInfos.commitMessage = 'commit message';
      gitMergePRInfos.method = PRMethodsEnum.Squash;

      gitlabService.mergePullRequest(gitApiInfos, gitMergePRInfos);

      const expectedUrl = `${
        gitlabService.urlApi
      }/projects/1/merge_requests/42/merge`;

      expectedConfig.params = {
        squash: true,
        merge_commit_message: 'commit message',
        squash_commit_message: 'commit message',
      };

      expect(httpService.put).toBeCalledWith(expectedUrl, {}, expectedConfig);
    });
  });

  describe('updatePullRequest', () => {
    it('should emit a PUT request with specific params', () => {
      const gitPRInfos = new GitPRInfos();
      gitPRInfos.number = 42;
      gitPRInfos.title = 'pr title';
      gitPRInfos.description = 'pr description';
      gitPRInfos.target = 'master';
      gitPRInfos.state = IssuePRStateEnum.Close;

      gitlabService.updatePullRequest(gitApiInfos, gitPRInfos);

      const expectedUrl = `${
        gitlabService.urlApi
      }/projects/1/merge_requests/42`;

      expectedConfig.params = {
        title: 'pr title',
        description: 'pr description',
        state_event: 'close',
        target_branch: 'master',
      };

      expect(httpService.put).toBeCalledWith(expectedUrl, {}, expectedConfig);
    });
  });

  describe('createWebhook', () => {
    it('should emit a POST request with specific params', () => {
      const webhookURL: string = 'https://some.url.com';

      gitlabService.createWebhook(gitApiInfos, webhookURL);

      const expectedUrl = `${gitlabService.urlApi}/projects/1/hooks`;

      expectedConfig.params = {
        confidential_issues_events: true,
        confidential_note_events: true,
        enable_ssl_verification: true,
        issues_events: true,
        job_events: true,
        merge_requests_events: true,
        note_events: true,
        pipeline_events: true,
        push_events: true,
        tag_push_events: true,
        url: 'https://some.url.com',
        wiki_page_events: true,
      };

      expect(httpService.post).toBeCalledWith(expectedUrl, {}, expectedConfig);
    });
  });

  describe('getIssues', () => {
    it('should emit a GET request with specific params', () => {
      const gitIssueSearch: GitIssuePRSearch = new GitIssuePRSearch();
      gitIssueSearch.state = IssuePRStateEnum.Open;
      gitIssueSearch.sort = IssueSortEnum.Asc;

      httpService.get = jest.fn().mockImplementationOnce((...args) => {
        return new Observable(observer => observer.next({ data: [] }));
      });

      gitlabService.getIssues(gitApiInfos, gitIssueSearch);

      const expectedUrl = `${gitlabService.urlApi}/projects/1/issues`;

      expectedConfig.params = {
        sort: 'asc',
        state: 'opened',
      };

      expect(httpService.get).toBeCalledWith(expectedUrl, expectedConfig);
    });
  });

  describe('getPullRequests', () => {
    it('should emit a GET request with specific params', () => {
      const gitIssueSearch: GitIssuePRSearch = new GitIssuePRSearch();
      gitIssueSearch.state = IssuePRStateEnum.Open;
      gitIssueSearch.sort = IssueSortEnum.Asc;

      httpService.get = jest.fn().mockImplementationOnce((...args) => {
        return new Observable(observer => observer.next({ data: [] }));
      });

      gitlabService.getPullRequests(gitApiInfos, gitIssueSearch);

      const expectedUrl = `${gitlabService.urlApi}/projects/1/merge_requests`;

      expectedConfig.params = {
        sort: 'asc',
        state: 'opened',
      };

      expect(httpService.get).toBeCalledWith(expectedUrl, expectedConfig);
    });
  });

  describe('createRelease', () => {
    it('should emit a POST request with specific params', () => {
      const gitRelease = new GitRelease();
      gitRelease.name = 'v0.0.1';
      gitRelease.tag = 'v0.0.1';
      gitRelease.description = 'this is the first release';

      const expectedUrl = `${gitlabService.urlApi}/projects/1/releases`;

      expectedConfig.params = {
        name: 'v0.0.1',
        tag_name: 'v0.0.1',
        description: 'this is the first release',
      };

      gitlabService.createRelease(gitApiInfos, gitRelease);

      expect(httpService.post).toBeCalledWith(expectedUrl, {}, expectedConfig);
    });
  });

  describe('createTag', () => {
    it('should emit a POST request with specific params', () => {
      const gitTag = new GitTag();
      gitTag.sha = '1';
      gitTag.tag = 'v0.0.1';
      gitTag.type = 'commit';
      gitTag.message = 'new tag';

      const expectedUrl = `${gitlabService.urlApi}/projects/1/repository/tags`;

      expectedConfig.params = {
        message: 'new tag',
        ref: '1',
        tag_name: 'v0.0.1',
      };

      gitlabService.createTag(gitApiInfos, gitTag);

      expect(httpService.post).toBeCalledWith(expectedUrl, {}, expectedConfig);
    });
  });

  // TESTS BEFORE

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
    it('should set the token and urlApi', async () => {
      dataAccessService.readEnv = jest.fn().mockReturnValue({
        gitApi: 'https://mygitlabapi.com',
        gitToken: 'gitlabToken',
      });

      await gitlabService.setEnvironmentVariables(
        dataAccessService,
        'myFilePath',
      );

      expect(gitlabService.token).toBe('gitlabToken');
      expect(gitlabService.urlApi).toBe('https://mygitlabapi.com');
    });
  });
});
