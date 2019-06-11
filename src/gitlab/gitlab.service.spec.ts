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
import { Observable, of } from 'rxjs';
import { GitlabService } from './gitlab.service';
import { GitFileInfos } from '../git/gitFileInfos';
import { DataAccessService } from '../data_access/dataAccess.service';
import { GitRelease } from '../git/gitRelease';
import { GitTag } from '../git/gitTag';
import { GitBranchCommit } from '../git/gitBranchSha';

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
    it('should emit a POST request with specific params', async () => {
      const gitIssueInfos = new GitIssueInfos();
      gitIssueInfos.title = 'my new issue';
      gitIssueInfos.description = 'my desc';
      gitIssueInfos.labels = ['good first issue', 'rules'];

      httpService.post = jest.fn().mockImplementationOnce(() => {
        return of({ data: { iid: 1 } });
      });

      await gitlabService.createIssue(gitApiInfos, gitIssueInfos);

      const expectedUrl = `${gitlabService.urlApi}/projects/1/issues`;

      expectedConfig.params = {
        title: 'my new issue',
        description: 'my desc',
        labels: 'good first issue,rules',
      };

      expect(httpService.post).toBeCalledWith(expectedUrl, {}, expectedConfig);

      // Restore mock
      httpService.post = jest.fn().mockImplementation(() => {
        return of([]);
      });
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

  describe('getLastBranchesCommitSha', () => {
    it('should emit a GET request with specific params', async () => {
      httpService.get = jest.fn().mockImplementationOnce((...args) => {
        return of({
          data: [
            {
              name: 'develop',
              commit: {
                id: 'c072f9cab23bbd992a3acc3ad6eb4a6c70c7c5aa',
                short_id: 'c072f9ca',
                created_at: '2019-05-23T14:37:12.000+00:00',
                parent_ids: null,
                title: 'Merge branch master into develop',
                message: 'Merge branch master into develop',
                author_name: 'Bastien Terrier',
                author_email: 'bastien.terrier@gmail.com',
                authored_date: '2019-05-23T14:37:12.000+00:00',
                committer_name: 'Bastien Terrier',
                committer_email: 'bastien.terrier@gmail.com',
                committed_date: '2019-05-23T14:37:12.000+00:00',
              },
              merged: false,
              protected: false,
              developers_can_push: false,
              developers_can_merge: false,
              can_push: false,
              default: false,
            },
            {
              name: 'gl-pages',
              commit: {
                id: '8a4d7d7d60d259679ef0edab2c156db8f7a7cd9d',
                short_id: '8a4d7d7d',
                created_at: '2019-06-03T13:12:14.000+00:00',
                parent_ids: null,
                title: 'Update README.md',
                message: 'Update README.md',
                author_name: 'Bastien Terrier',
                author_email: 'bastien.terrier@gmail.com',
                authored_date: '2019-06-03T13:12:14.000+00:00',
                committer_name: 'Bastien Terrier',
                committer_email: 'bastien.terrier@gmail.com',
                committed_date: '2019-06-03T13:12:14.000+00:00',
              },
              merged: false,
              protected: false,
              developers_can_push: false,
              developers_can_merge: false,
              can_push: false,
              default: false,
            },
            {
              name: 'master',
              commit: {
                id: '9bcd827d36537f861c209a0b2a4d3006a281b707',
                short_id: '9bcd827d',
                created_at: '2019-06-04T14:31:27.000+00:00',
                parent_ids: null,
                title: 'test',
                message: 'test',
                author_name: 'TERRIER Bastien',
                author_email: 'bastien.terrier@gmail.com',
                authored_date: '2019-06-04T14:31:27.000+00:00',
                committer_name: 'TERRIER Bastien',
                committer_email: 'bastien.terrier@gmail.com',
                committed_date: '2019-06-04T14:31:27.000+00:00',
              },
              merged: false,
              protected: true,
              developers_can_push: false,
              developers_can_merge: false,
              can_push: false,
              default: true,
            },
            {
              name: 'somebranch',
              commit: {
                id: 'b01a3298ec6f410bbcdf13667a6f6fda6d655442',
                short_id: 'b01a3298',
                created_at: '2019-06-04T10:43:54.000+00:00',
                parent_ids: null,
                title: 'fix(): #v0.1.0#',
                message: 'fix(): #v0.1.0#',
                author_name: 'TERRIER Bastien',
                author_email: 'bastien.terrier@gmail.com',
                authored_date: '2019-06-04T10:43:54.000+00:00',
                committer_name: 'TERRIER Bastien',
                committer_email: 'bastien.terrier@gmail.com',
                committed_date: '2019-06-04T10:43:54.000+00:00',
              },
              merged: true,
              protected: false,
              developers_can_push: false,
              developers_can_merge: false,
              can_push: false,
              default: false,
            },
          ],
        });
      });

      const result: GitBranchCommit[] = await gitlabService.getLastBranchesCommitSha(
        gitApiInfos,
      );

      const expectedUrl = `${
        gitlabService.urlApi
      }/projects/1/repository/branches`;

      expectedConfig.params = {};

      expect(httpService.get).toBeCalledWith(expectedUrl, expectedConfig);
      expect(result).toEqual([
        {
          branch: 'develop',
          commitSha: 'c072f9cab23bbd992a3acc3ad6eb4a6c70c7c5aa',
        },
        {
          branch: 'gl-pages',
          commitSha: '8a4d7d7d60d259679ef0edab2c156db8f7a7cd9d',
        },
        {
          branch: 'master',
          commitSha: '9bcd827d36537f861c209a0b2a4d3006a281b707',
        },
        {
          branch: 'somebranch',
          commitSha: 'b01a3298ec6f410bbcdf13667a6f6fda6d655442',
        },
      ]);
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
