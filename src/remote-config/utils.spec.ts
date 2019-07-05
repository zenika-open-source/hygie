import { TestingModule, Test } from '@nestjs/testing';
import { HttpService } from '@nestjs/common';
import {
  MockHttpService,
  MockGitlabService,
  MockGithubService,
  MockDataAccessService,
} from '../__mocks__/mocks';
import { RemoteConfigUtils } from './utils';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { GitTypeEnum } from '../webhook/utils.enum';
import { of } from 'rxjs';
import { DataAccessService } from '../data_access/dataAccess.service';
import { FileAccess } from '../data_access/providers/fileAccess';
import { Constants } from '../utils/constants';

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
      githubService.getFileContent = jest
        .fn()
        .mockResolvedValue({ data: 'somedata' });
      const result: string = await RemoteConfigUtils.downloadRulesFile(
        dataAccessService,
        httpService,
        githubService,
        gitlabService,
        'https://github.com/DX-DeveloperExperience/hygie',
        Constants.rulesExtension,
      );
      expect(result).toBe('remote-rules/DX-DeveloperExperience/hygie/.hygie');
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

      gitlabService.getFileContent = jest
        .fn()
        .mockResolvedValue({ data: 'somedata' });
      const result: string = await RemoteConfigUtils.downloadRulesFile(
        dataAccessService,
        httpService,
        githubService,
        gitlabService,
        'https://gitlab.com/gitlab-org/gitlab-ce',
        Constants.rulesExtension,
      );
      expect(result).toBe('remote-rules/gitlab-org/gitlab-ce/.hygie');
    });
  });
  describe('registerConfigEnv', () => {
    it('should call writeEnv and checkIfEnvExist methods this good args', async () => {
      const configEnv = {
        gitApi: 'https://gitapi.com',
        gitToken: 'azertyuiop',
        gitRepo: 'https://github.com/DX-DeveloperExperience/hygie',
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
        'remote-envs/DX-DeveloperExperience/hygie/config.env',
      );

      expect(dataAccessService.writeEnv).toHaveBeenCalledWith(
        'remote-envs/DX-DeveloperExperience/hygie/config.env',
        {
          gitApi: 'https://gitapi.com',
          gitToken: 'azertyuiop',
          git: GitTypeEnum.Github,
        },
      );
    });
  });

  describe('RemoteConfigUtils', () => {
    it('should return a Github URL path', () => {
      expect(
        RemoteConfigUtils.getGitRawPath(
          GitTypeEnum.Github,
          'https://github.com/DX-DeveloperExperience/hygie',
          'package.json',
        ),
      ).toBe(
        'https://raw.githubusercontent.com/DX-DeveloperExperience/hygie/master/package.json',
      );
    });
  });
  describe('RemoteConfigUtils', () => {
    it('should return a Github URL path', () => {
      expect(
        RemoteConfigUtils.getGitRawPath(
          GitTypeEnum.Github,
          'https://github.com/bastienterrier/test-webhook',
          `.hygie/${Constants.rulesExtension}`,
          'test',
        ),
      ).toBe(
        `https://raw.githubusercontent.com/bastienterrier/test-webhook/test/.hygie/${
          Constants.rulesExtension
        }`,
      );
    });
  });
  describe('RemoteConfigUtils', () => {
    it('should return a Gitlab URL path', () => {
      expect(
        RemoteConfigUtils.getGitRawPath(
          GitTypeEnum.Gitlab,
          'https://gitlab.com/bastien.terrier/test_webhook',
          `.hygie/${Constants.rulesExtension}`,
        ),
      ).toBe(
        `https://gitlab.com/bastien.terrier/test_webhook/raw/master/.hygie/${
          Constants.rulesExtension
        }`,
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

  describe('getGitType', () => {
    it('should return a Github', () => {
      expect(
        RemoteConfigUtils.getGitType(
          'https://github.com/DX-DeveloperExperience/hygie',
        ),
      ).toBe(GitTypeEnum.Github);
    });
    it('should return a Gitlab', () => {
      expect(
        RemoteConfigUtils.getGitType('https://gitlab.com/gitlab-org/gitlab-ce'),
      ).toBe(GitTypeEnum.Gitlab);
    });
    it('should return a Undefined', () => {
      expect(RemoteConfigUtils.getGitType('https://facebook.com')).toBe(
        GitTypeEnum.Undefined,
      );
    });
  });
});
