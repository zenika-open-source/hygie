import { Test, TestingModule } from '@nestjs/testing';
import { GithubService } from '../github/github.service';
import { HttpService } from '@nestjs/common';
import {
  MockHttpService,
  MockObservable,
  MockDataAccessService,
} from '../__mocks__/mocks';
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
import { GitFileInfos } from '../git/gitFileInfos';
import { DataAccessService } from '../data_access/dataAccess.service';
import { GitRelease } from '../git/gitRelease';
import { GitCommit } from '../git/gitCommit';
import { GitRef } from '../git/gitRef';
import { GitTag } from '../git/gitTag';
import { GitBranchCommit } from '../git/gitBranchSha';
import { logger } from '../logger/logger.service';
import { Utils } from '../utils/utils';

describe('Github Service', () => {
  let app: TestingModule;
  let githubService: GithubService;
  let httpService: HttpService;
  let dataAccessService: DataAccessService;

  let gitCommitStatusInfos: GitCommitStatusInfos;

  let expectedConfig;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        { provide: HttpService, useClass: MockHttpService },
        { provide: Observable, useClass: MockObservable },
        { provide: DataAccessService, useClass: MockDataAccessService },
        GithubService,
      ],
    }).compile();

    githubService = app.get(GithubService);
    httpService = app.get(HttpService);
    dataAccessService = app.get(DataAccessService);

    githubService.setToken('0123456789abcdef');
    githubService.setUrlApi('https://api.github.com');
    githubService.setRepositoryFullName('bastienterrier/test');
    githubService.setConfigGitHub({
      headers: {
        Authorization: `token 0123456789abcdef`,
      },
    });

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

      githubService.updateCommitStatus(gitCommitStatusInfos);

      const expectedUrl = `https://api.github.com/repos/bastienterrier/test/statuses/1`;
      const expectedData = {
        context: process.env.APPLICATION_NAME + '/commit',
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

      githubService.addIssueComment(gitIssueInfos);

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

  describe('updateIssue', () => {
    it('should emit a PATCH request with specific params', () => {
      const gitIssueInfos = new GitIssueInfos();
      gitIssueInfos.number = '1';
      gitIssueInfos.state = IssuePRStateEnum.Close;

      githubService.updateIssue(gitIssueInfos);

      const expectedUrl = `https://api.github.com/repos/bastienterrier/test/issues/1`;

      const expectedData = {
        state: 'closed',
      };

      expect(httpService.patch).toBeCalledWith(
        expectedUrl,
        expectedData,
        expectedConfig,
      );
    });

    it('should emit a PATCH request with specific params', () => {
      const gitIssueInfos = new GitIssueInfos();
      gitIssueInfos.number = '1';
      gitIssueInfos.state = IssuePRStateEnum.Open;

      githubService.updateIssue(gitIssueInfos);

      const expectedUrl = `https://api.github.com/repos/bastienterrier/test/issues/1`;

      const expectedData = {
        state: 'open',
      };

      expect(httpService.patch).toBeCalledWith(
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

      githubService.addPRComment(gitCommentPRInfos);

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
      const gitCreatePRInfos = new GitPRInfos();
      gitCreatePRInfos.title = 'my PR';
      gitCreatePRInfos.description = 'my desc';
      gitCreatePRInfos.source = 'develop';
      gitCreatePRInfos.target = 'master';

      githubService.createPullRequest(gitCreatePRInfos);

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

  describe('createIssue', () => {
    it('should emit a POST request with specific params', async () => {
      const gitIssueInfos = new GitIssueInfos();
      gitIssueInfos.title = 'my new issue';
      gitIssueInfos.description = 'my desc';
      gitIssueInfos.assignees = ['bastienterrier'];
      gitIssueInfos.labels = ['good first issue'];

      httpService.post = jest.fn().mockImplementationOnce((...args) => {
        return of({ data: { number: 1 } });
      });

      await githubService.createIssue(gitIssueInfos);

      const expectedUrl = `https://api.github.com/repos/bastienterrier/test/issues`;

      const expectedData = {
        title: 'my new issue',
        body: 'my desc',
        assignees: ['bastienterrier'],
        labels: ['good first issue'],
      };

      expect(httpService.post).toBeCalledWith(
        expectedUrl,
        expectedData,
        expectedConfig,
      );

      // Restore mock
      httpService.post = jest.fn().mockImplementation(() => {
        return of([]);
      });
    });
  });

  describe('deleteFile', () => {
    it('should emit GET and POST requests with specific params', () => {
      const gitFileInfos = new GitFileInfos();
      gitFileInfos.fileBranch = 'master';
      gitFileInfos.filePath = 'file/to/remove.txt';
      gitFileInfos.commitMessage = 'remove file/to/remove.txt';

      // const firstGetReturned = Observable.create(observer => {
      //   observer.next({
      //     sha: 'e69de29bb2d1d6434b8b29ae775ad8c2e48c5391',
      //   });
      //   observer.complete();
      // });

      httpService.get = jest.fn().mockImplementationOnce(() => {
        return of({
          data: {
            sha: 'tee69de29bb2d1d6434b8b29ae775ad8c2e48c5391st',
          },
        });
      });

      githubService.deleteFile(gitFileInfos).catch(err => logger.error(err));

      const expectedUrl1 = `https://api.github.com/repos/bastienterrier/test/contents/file/to/remove.txt`;
      const expectedUrl2 = `https://api.github.com/repos/bastienterrier/test/contents/file/to/remove.txt`;

      const expectedConfig2 = JSON.parse(JSON.stringify(expectedConfig));
      expectedConfig2.params = {
        branch: 'master',
        message: 'remove file/to/remove.txt',
        sha: 'tee69de29bb2d1d6434b8b29ae775ad8c2e48c5391st',
      };

      expect(httpService.get).toBeCalledWith(expectedUrl1, expectedConfig);
      expect(httpService.delete).toBeCalledWith(expectedUrl2, expectedConfig2);
    });
  });

  describe('deleteBranch', () => {
    it('should emit a DELETE request with specific params', () => {
      githubService.deleteBranch('feature/test');

      const expectedUrl = `https://api.github.com/repos/bastienterrier/test/git/refs/heads/feature%2Ftest`;

      expect(httpService.delete).toBeCalledWith(expectedUrl, expectedConfig);
    });
  });

  describe('mergePullRequest', () => {
    it('should emit a PUT request with specific params', () => {
      const gitMergePRInfos = new GitMergePRInfos();
      gitMergePRInfos.number = 42;
      gitMergePRInfos.commitTitle = 'commit title';
      gitMergePRInfos.commitMessage = 'commit message';
      gitMergePRInfos.method = PRMethodsEnum.Merge;

      githubService.mergePullRequest(gitMergePRInfos);

      const expectedUrl = `https://api.github.com/repos/bastienterrier/test/pulls/42/merge`;

      const expectedData = {
        commit_title: 'commit title',
        commit_message: 'commit message',
        merge_method: 'merge',
      };

      expect(httpService.put).toBeCalledWith(
        expectedUrl,
        expectedData,
        expectedConfig,
      );
    });
  });

  describe('updatePullRequest', () => {
    it('should emit a PATCH request with specific params', () => {
      const gitPRInfos = new GitPRInfos();
      gitPRInfos.number = 42;
      gitPRInfos.title = 'pr title';
      gitPRInfos.description = 'pr description';
      gitPRInfos.target = 'master';
      gitPRInfos.state = IssuePRStateEnum.Close;

      githubService.updatePullRequest(gitPRInfos);

      const expectedUrl = `https://api.github.com/repos/bastienterrier/test/pulls/42`;

      const expectedData = {
        title: 'pr title',
        body: 'pr description',
        state: 'closed',
        base: 'master',
      };

      expect(httpService.patch).toBeCalledWith(
        expectedUrl,
        expectedData,
        expectedConfig,
      );
    });
  });

  describe('createWebhook', () => {
    it('should emit a POST request with specific params', () => {
      const webhookURL: string = 'https://some.url.com';

      githubService.createWebhook(webhookURL);

      const expectedUrl = `https://api.github.com/repos/bastienterrier/test/hooks`;

      const expectedData = {
        active: true,
        config: { content_type: 'json', url: 'https://some.url.com' },
        events: ['*'],
        name: 'web',
      };

      expect(httpService.post).toBeCalledWith(
        expectedUrl,
        expectedData,
        expectedConfig,
      );
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

      githubService.getIssues(gitIssueSearch).catch(err => logger.error(err));
      const expectedUrl = `https://api.github.com/repos/bastienterrier/test/issues`;

      const expectedConfig2 = JSON.parse(JSON.stringify(expectedConfig));
      expectedConfig2.params = {
        direction: 'asc',
        state: 'open',
      };

      expect(httpService.get).toBeCalledWith(expectedUrl, expectedConfig2);
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

      githubService
        .getPullRequests(gitIssueSearch)
        .catch(err => logger.error(err));
      const expectedUrl = `https://api.github.com/repos/bastienterrier/test/pulls`;

      const expectedConfig2 = JSON.parse(JSON.stringify(expectedConfig));
      expectedConfig2.params = {
        direction: 'asc',
        state: 'open',
      };

      expect(httpService.get).toBeCalledWith(expectedUrl, expectedConfig2);
    });
  });

  describe('createRelease', () => {
    it('should emit a POST request with specific params', () => {
      const gitRelease = new GitRelease();
      gitRelease.name = 'v0.0.1';
      gitRelease.tag = 'v0.0.1';
      gitRelease.description = 'this is the first release';

      githubService.createRelease(gitRelease);

      const expectedUrl = `https://api.github.com/repos/bastienterrier/test/releases`;

      const expectedData = {
        body: 'this is the first release',
        tag_name: 'v0.0.1',
        name: 'v0.0.1',
      };

      expect(httpService.post).toBeCalledWith(
        expectedUrl,
        expectedData,
        expectedConfig,
      );
    });
  });

  describe('getTree', () => {
    it('should emit a GET request with specific params', () => {
      httpService.get = jest.fn().mockImplementationOnce(() => {
        return of({
          data: [{ name: 'path', sha: 'sha' }],
        });
      });
      githubService.getTree('your/folder/path').catch(err => logger.error(err));

      const customConfig = JSON.parse(JSON.stringify(expectedConfig));
      customConfig.params = { ref: 'master' };

      const expectedUrl = `https://api.github.com/repos/bastienterrier/test/contents/your/folder`;

      expect(httpService.get).toBeCalledWith(expectedUrl, customConfig);
    });
  });

  describe('getLastCommit', () => {
    it('should emit a GET request with specific params', async () => {
      httpService.get = jest.fn().mockImplementationOnce((...args) => {
        return of({ data: { object: { sha: '0123456789abcdef' } } });
      });

      await githubService.getLastCommit('develop');

      const expectedUrl = `https://api.github.com/repos/bastienterrier/test/git/refs/heads/develop`;

      expect(httpService.get).toBeCalledWith(expectedUrl, expectedConfig);
    });
  });
  describe('createCommit', () => {
    it('should emit a POST request with specific params', () => {
      const gitCommit = new GitCommit();
      gitCommit.message = 'commit message';
      gitCommit.parents = ['1'];
      gitCommit.tree = 'treesha';

      httpService.post = jest.fn().mockImplementationOnce((...args) => {
        return new Observable(observer => observer.next({ data: [] }));
      });

      githubService.createCommit(gitCommit).catch(err => logger.error(err));

      const expectedUrl = `https://api.github.com/repos/bastienterrier/test/git/commits`;

      const expectedData = {
        message: 'commit message',
        parents: ['1'],
        tree: 'treesha',
      };

      expect(httpService.post).toBeCalledWith(
        expectedUrl,
        expectedData,
        expectedConfig,
      );
    });
  });

  describe('updateRef', () => {
    it('should emit a PATCH request with specific params', () => {
      const gitRef = new GitRef();
      gitRef.refName = 'refs/heads/develop';
      gitRef.sha = 'sha';
      githubService.updateRef(gitRef);

      const expectedUrl = `https://api.github.com/repos/bastienterrier/test/git/refs/heads/develop`;

      const expectedData = {
        sha: 'sha',
      };

      expect(httpService.patch).toBeCalledWith(
        expectedUrl,
        expectedData,
        expectedConfig,
      );
    });
  });

  describe('createRef', () => {
    it('should emit a POST request with specific params', () => {
      const gitRef = new GitRef();
      gitRef.refName = 'refs/heads/develop';
      gitRef.sha = 'sha';

      httpService.post = jest.fn().mockImplementationOnce((...args) => {
        return new Observable(observer => observer.next({ data: [] }));
      });

      githubService.createRef(gitRef);

      const expectedUrl = `https://api.github.com/repos/bastienterrier/test/git/refs`;

      const expectedData = {
        sha: 'sha',
        ref: 'refs/heads/develop',
      };

      expect(httpService.post).toBeCalledWith(
        expectedUrl,
        expectedData,
        expectedConfig,
      );
    });
  });
  describe('createTag', () => {
    it('should emit a POST request with specific params', () => {
      httpService.post = jest.fn().mockImplementationOnce((...args) => {
        return of({ data: { sha: 'sha' } });
      });

      const gitTag = new GitTag();
      gitTag.sha = '1';
      gitTag.tag = 'v0.0.1';
      gitTag.type = 'commit';
      gitTag.message = 'new tag';

      githubService.createTag(gitTag).catch(err => logger.error(err));

      const expectedUrl = `https://api.github.com/repos/bastienterrier/test/git/tags`;

      const expectedData = {
        tag: gitTag.tag,
        message: gitTag.message,
        object: gitTag.sha,
        type: gitTag.type,
      };

      expect(httpService.post).toBeCalledWith(
        expectedUrl,
        expectedData,
        expectedConfig,
      );
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
                sha: '9c036a26fc5c26b68025d2b7d7fcf757d4dec36e',
                url:
                  'https://api.github.com/repos/DX-DeveloperExperience/hygie/commits/9c036a26fc5c26b68025d2b7d7fcf757d4dec36e',
              },
              protected: false,
              protection: {
                enabled: false,
                required_status_checks: {
                  enforcement_level: 'off',
                  contexts: [],
                },
              },
              protection_url:
                'https://api.github.com/repos/DX-DeveloperExperience/hygie/branches/develop/protection',
            },
            {
              name: 'gh-pages',
              commit: {
                sha: 'e82fef381b423754a2ca783e18dfb1eeac6aeec3',
                url:
                  'https://api.github.com/repos/DX-DeveloperExperience/hygie/commits/e82fef381b423754a2ca783e18dfb1eeac6aeec3',
              },
              protected: false,
              protection: {
                enabled: false,
                required_status_checks: {
                  enforcement_level: 'off',
                  contexts: [],
                },
              },
              protection_url:
                'https://api.github.com/repos/DX-DeveloperExperience/hygie/branches/gh-pages/protection',
            },
            {
              name: 'master',
              commit: {
                sha: 'eeaa4df1b847cd53378c0fcb457b83bad5224738',
                url:
                  'https://api.github.com/repos/DX-DeveloperExperience/hygie/commits/eeaa4df1b847cd53378c0fcb457b83bad5224738',
              },
              protected: false,
              protection: {
                enabled: false,
                required_status_checks: {
                  enforcement_level: 'off',
                  contexts: [],
                },
              },
              protection_url:
                'https://api.github.com/repos/DX-DeveloperExperience/hygie/branches/master/protection',
            },
            {
              name: 'renovate/express-4.x',
              commit: {
                sha: '31ed1b43b7f80c4a58a9b20f173f72b2b369c19f',
                url:
                  'https://api.github.com/repos/DX-DeveloperExperience/hygie/commits/31ed1b43b7f80c4a58a9b20f173f72b2b369c19f',
              },
              protected: false,
              protection: {
                enabled: false,
                required_status_checks: {
                  enforcement_level: 'off',
                  contexts: [],
                },
              },
              protection_url:
                'https://api.github.com/repos/DX-DeveloperExperience/hygie/branches/renovate/express-4.x/protection',
            },
            {
              name: 'renovate/googleapis-40.x',
              commit: {
                sha: 'c93f1779441198daef276a50a274d16a5a83dd4e',
                url:
                  'https://api.github.com/repos/DX-DeveloperExperience/hygie/commits/c93f1779441198daef276a50a274d16a5a83dd4e',
              },
              protected: false,
              protection: {
                enabled: false,
                required_status_checks: {
                  enforcement_level: 'off',
                  contexts: [],
                },
              },
              protection_url:
                'https://api.github.com/repos/DX-DeveloperExperience/hygie/branches/renovate/googleapis-40.x/protection',
            },
            {
              name: 'renovate/nest-monorepo',
              commit: {
                sha: '9d968cc538b9796ec61e78f4055814028e816858',
                url:
                  'https://api.github.com/repos/DX-DeveloperExperience/hygie/commits/9d968cc538b9796ec61e78f4055814028e816858',
              },
              protected: false,
              protection: {
                enabled: false,
                required_status_checks: {
                  enforcement_level: 'off',
                  contexts: [],
                },
              },
              protection_url:
                'https://api.github.com/repos/DX-DeveloperExperience/hygie/branches/renovate/nest-monorepo/protection',
            },
          ],
        });
      });

      const result: GitBranchCommit[] = await githubService.getLastBranchesCommitSha();

      const expectedUrl = `https://api.github.com/repos/bastienterrier/test/branches`;

      expect(httpService.get).toBeCalledWith(expectedUrl, expectedConfig);
      expect(result).toEqual([
        {
          commitSha: '9c036a26fc5c26b68025d2b7d7fcf757d4dec36e',
          branch: 'develop',
        },
        {
          commitSha: 'e82fef381b423754a2ca783e18dfb1eeac6aeec3',
          branch: 'gh-pages',
        },
        {
          commitSha: 'eeaa4df1b847cd53378c0fcb457b83bad5224738',
          branch: 'master',
        },
        {
          commitSha: '31ed1b43b7f80c4a58a9b20f173f72b2b369c19f',
          branch: 'renovate/express-4.x',
        },
        {
          commitSha: 'c93f1779441198daef276a50a274d16a5a83dd4e',
          branch: 'renovate/googleapis-40.x',
        },
        {
          commitSha: '9d968cc538b9796ec61e78f4055814028e816858',
          branch: 'renovate/nest-monorepo',
        },
      ]);
    });
  });

  // TESTS BEFORE

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

  describe('setRepositoryFullName', () => {
    it('should set the repositoryFullName', () => {
      githubService.setRepositoryFullName('some/repo');
      expect(githubService.repositoryFullName).toBe('some/repo');
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
    it('should set the token and urlApi', async () => {
      process.env.ENCRYPTION_KEY = 'somekey';
      dataAccessService.readEnv = jest.fn().mockReturnValue({
        gitApi: 'https://mygithubapi.com',
        gitToken: Utils.encryptToken('githubToken'),
      });

      githubService.setToken = jest.fn().mockName('setTokenGithub');
      githubService.setUrlApi = jest.fn().mockName('setUrlApiGithub');
      githubService.setRepositoryFullName = jest
        .fn()
        .mockName('setRepositoryFullNameGithub');

      await githubService.setEnvironmentVariables(
        dataAccessService,
        'some/repo',
      );

      expect(githubService.setToken).toBeCalledWith('githubToken');
      expect(githubService.setUrlApi).toBeCalledWith('https://mygithubapi.com');
      expect(githubService.setRepositoryFullName).toBeCalledWith('some/repo');
    });
  });
});
