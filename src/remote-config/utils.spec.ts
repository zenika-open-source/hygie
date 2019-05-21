import { TestingModule, Test } from '@nestjs/testing';
import { HttpService } from '@nestjs/common';
import {
  MockHttpService,
  MockGitlabService,
  MockGithubService,
  MockDataAccessService,
} from '../__mocks__/mocks';
import { RemoteConfigUtils } from './utils';
import { Utils } from '../utils/utils';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { GitTypeEnum } from '../webhook/utils.enum';
import { of } from 'rxjs';
import { DataAccessService } from '../data_access/dataAccess.service';
import { FileAccess } from '../data_access/providers/fileAccess';
import { DatabaseAccess } from '../data_access/providers/databaseAccess';

describe('remote-config', () => {
  let app: TestingModule;
  let httpService: HttpService;
  let dataAccessService: DataAccessService;

  let githubService: GithubService;
  let gitlabService: GitlabService;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        { provide: HttpService, useClass: MockHttpService },
        { provide: GitlabService, useClass: MockGitlabService },
        { provide: GithubService, useClass: MockGithubService },
        { provide: DataAccessService, useClass: MockDataAccessService },
        {
          provide: 'DataAccessInterface',
          useFactory() {
            return new FileAccess();
          },
        },
      ],
    }).compile();

    httpService = app.get(HttpService);
    githubService = app.get(GithubService);
    gitlabService = app.get(GitlabService);
    dataAccessService = app.get(DataAccessService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('checkDownloadSize', () => {
    it('should call httpService.head method', async () => {
      httpService.head = jest.fn().mockImplementationOnce(() => {
        return of({
          headers: {
            'content-length': 500,
          },
        });
      });
      await RemoteConfigUtils.checkDownloadSize(
        httpService,
        'https://github.com',
      );

      expect(httpService.head).toBeCalledWith('https://github.com');
    });
  });

  describe('downloadRulesFile', () => {
    it('should call httpService.get method and return the good repo', async () => {
      httpService.head = jest.fn().mockImplementationOnce(() => {
        return of({
          headers: {
            'content-length': 500,
          },
        });
      });
      const result: string = await RemoteConfigUtils.downloadRulesFile(
        dataAccessService,
        httpService,
        'https://github.com/DX-DeveloperExperience/git-webhooks',
        'rules.yml',
      );
      expect(httpService.get).toBeCalledWith(
        'https://raw.githubusercontent.com/DX-DeveloperExperience/git-webhooks/master/.git-webhooks/rules.yml',
      );
      expect(result).toBe(
        'remote-rules/DX-DeveloperExperience/git-webhooks/.git-webhooks',
      );
    });
  });
  describe('downloadRulesFile', () => {
    it('should call httpService.get method and return the good repo', async () => {
      httpService.head = jest.fn().mockImplementationOnce(() => {
        return of({
          headers: {
            'content-length': 500,
          },
        });
      });
      const result: string = await RemoteConfigUtils.downloadRulesFile(
        dataAccessService,
        httpService,
        'https://gitlab.com/gitlab-org/gitlab-ce',
        'rules.yml',
      );
      expect(httpService.get).toBeCalledWith(
        'https://gitlab.com/gitlab-org/gitlab-ce/raw/master/.git-webhooks/rules.yml',
      );
      expect(result).toBe('remote-rules/gitlab-org/gitlab-ce/.git-webhooks');
    });
  });
  describe('registerConfigEnv', () => {
    it('should call writeEnv and checkIfEnvExist methods this good args', async () => {
      const configEnv = {
        gitApi: 'https://gitapi.com',
        gitToken: 'azertyuiop',
        gitRepo: 'https://github.com/DX-DeveloperExperience/git-webhooks',
      };

      await RemoteConfigUtils.registerConfigEnv(
        dataAccessService,
        httpService,
        githubService,
        gitlabService,
        configEnv,
        'https://some.url.com',
      );

      expect(dataAccessService.checkIfEnvExist).toHaveBeenCalledWith(
        'remote-envs/DX-DeveloperExperience/git-webhooks/config.env',
      );

      expect(dataAccessService.writeEnv).toHaveBeenCalledWith(
        'remote-envs/DX-DeveloperExperience/git-webhooks/config.env',
        { gitApi: 'https://gitapi.com', gitToken: 'azertyuiop' },
      );
    });
  });

  describe('RemoteConfigUtils', () => {
    it('should return a Github URL path', () => {
      expect(
        RemoteConfigUtils.getGitRawPath(
          GitTypeEnum.Github,
          'https://github.com/DX-DeveloperExperience/git-webhooks',
          'package.json',
        ),
      ).toBe(
        'https://raw.githubusercontent.com/DX-DeveloperExperience/git-webhooks/master/package.json',
      );
    });
  });
  describe('RemoteConfigUtils', () => {
    it('should return a Github URL path', () => {
      expect(
        RemoteConfigUtils.getGitRawPath(
          GitTypeEnum.Github,
          'https://github.com/bastienterrier/test-webhook',
          '.git-webhooks/rules.yml',
          'test',
        ),
      ).toBe(
        'https://raw.githubusercontent.com/bastienterrier/test-webhook/test/.git-webhooks/rules.yml',
      );
    });
  });
  describe('RemoteConfigUtils', () => {
    it('should return a Gitlab URL path', () => {
      expect(
        RemoteConfigUtils.getGitRawPath(
          GitTypeEnum.Gitlab,
          'https://gitlab.com/bastien.terrier/test_webhook',
          '.git-webhooks/rules.yml',
        ),
      ).toBe(
        'https://gitlab.com/bastien.terrier/test_webhook/raw/master/.git-webhooks/rules.yml',
      );
    });
  });

  describe('getAccessToken', () => {
    it('shoud return the token part', () => {
      expect(
        RemoteConfigUtils.getAccessToken(
          'access_token=e72e16c7e42f292c6912e7710c838347ae178b4a&token_type=bearer',
        ),
      ).toBe('e72e16c7e42f292c6912e7710c838347ae178b4a');
    });
    it('shoud return the token part', () => {
      expect(
        RemoteConfigUtils.getAccessToken(
          'token_type=bearer&access_token=a72e16c7e42f292c6912e7710c838347ae178b4a',
        ),
      ).toBe('a72e16c7e42f292c6912e7710c838347ae178b4a');
    });
  });
});
