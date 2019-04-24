import { TestingModule, Test } from '@nestjs/testing';
import { HttpService } from '@nestjs/common';
import {
  MockHttpService,
  MockGitlabService,
  MockGithubService,
} from '../__mocks__/mocks';
import { RemoteConfigUtils } from './utils';
import { Utils } from '../utils/utils';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';

describe('remote-config', () => {
  let app: TestingModule;
  let httpService: HttpService;

  let githubService: GithubService;
  let gitlabService: GitlabService;

  Utils.writeFileSync = jest.fn();

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        { provide: HttpService, useClass: MockHttpService },
        { provide: GitlabService, useClass: MockGitlabService },
        { provide: GithubService, useClass: MockGithubService },
      ],
    }).compile();

    httpService = app.get(HttpService);
    githubService = app.get(GithubService);
    gitlabService = app.get(GitlabService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('downloadRulesFile', () => {
    it('should call httpService.get method and return the good repo', async () => {
      const result: string = await RemoteConfigUtils.downloadRulesFile(
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
      const result: string = await RemoteConfigUtils.downloadRulesFile(
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
    it('should call writeFileSync method this good args', () => {
      const configEnv = {
        gitApi: 'https://gitapi.com',
        gitToken: 'azertyuiop',
        gitRepo: 'https://github.com/DX-DeveloperExperience/git-webhooks',
      };

      RemoteConfigUtils.registerConfigEnv(
        httpService,
        githubService,
        gitlabService,
        configEnv,
      );

      expect(Utils.writeFileSync).toHaveBeenCalledWith(
        'remote-envs/DX-DeveloperExperience/git-webhooks/config.env',
        `gitApi=https://gitapi.com\ngitToken=azertyuiop`,
      );
    });
  });
});
