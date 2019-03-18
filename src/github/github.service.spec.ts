import { Test, TestingModule } from '@nestjs/testing';
import { GithubService } from '../github/github.service';
import { HttpService } from '@nestjs/common';
import { MockHttpService, MockObservable } from '../__mocks__/mocks';
import { GitApiInfos } from '../git/gitApiInfos';
import { GitCommitStatusInfos } from '../git/gitCommitStatusInfos';
import { GitTypeEnum, CommitStatusEnum } from '../webhook/utils.enum';
import { GitIssueInfos } from '../git/gitIssueInfos';
import { GitCreatePRInfos, GitCommentPRInfos } from '../git/gitPRInfos';
import { Observable } from 'rxjs';

require('dotenv').config({ path: 'config.env' });

describe('RulesService', () => {
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

    gitApiInfos = new GitApiInfos();
    gitApiInfos.repositoryFullName = 'bastienterrier/test';

    expectedConfig = {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
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

      const expectedUrl = `${
        process.env.GITHUB_API
      }/repos/bastienterrier/test/statuses/1`;

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

      const expectedUrl = `${
        process.env.GITHUB_API
      }/repos/bastienterrier/test/issues/1/comments`;

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

      const expectedUrl = `${
        process.env.GITHUB_API
      }/repos/bastienterrier/test/issues/1/comments`;

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

      const expectedUrl = `${
        process.env.GITHUB_API
      }/repos/bastienterrier/test/pulls`;

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
});
