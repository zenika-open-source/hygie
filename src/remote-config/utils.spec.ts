import { TestingModule, Test } from '@nestjs/testing';
import { HttpService } from '@nestjs/common';
import { MockHttpService } from '../__mocks__/mocks';
import { RemoteConfigUtils } from './utils';

describe('remote-config', () => {
  let app: TestingModule;
  let httpService: HttpService;

  RemoteConfigUtils.writeFileSync = jest.fn();

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [{ provide: HttpService, useClass: MockHttpService }],
    }).compile();

    httpService = app.get(HttpService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* describe('writeFileSync', () => {
    it('should call fs.writeFileSync', () => {
      const fs = require('fs');
      jest.mock('fs');
      fs.writeFileSync.mockReturnValue(true);

      const spy = jest.spyOn(fs, 'writeFileSync');

      RemoteConfigUtils.writeFileSync(
        'remote-rules/DX-DeveloperExperience/git-webhooks/.git-webhooks/rules.yml',
        'fileContent',
      );
      expect(spy).toBeCalled();
    });
  }); */

  describe('downloadRulesFile', () => {
    it('should call httpService.get method', () => {
      const result: string = RemoteConfigUtils.downloadRulesFile(
        httpService,
        'https://github.com/DX-DeveloperExperience/git-webhooks',
      );
      expect(httpService.get).toBeCalledWith(
        'https://raw.githubusercontent.com/DX-DeveloperExperience/git-webhooks/master/.git-webhooks/rules.yml',
      );
    });
    it('should return the good repo', () => {
      const result: string = RemoteConfigUtils.downloadRulesFile(
        httpService,
        'https://github.com/DX-DeveloperExperience/git-webhooks',
      );
      expect(result).toBe(
        'remote-rules/DX-DeveloperExperience/git-webhooks/.git-webhooks',
      );
    });
  });

  describe('registerConfigEnv', () => {
    it('should call writeFileSync method this good args', () => {
      const configEnv = {
        gitApi: 'https://gitapi.com',
        gitToken: 'azertyuiop',
        gitRepo: 'https://github.com/DX-DeveloperExperience/git-webhooks',
      };

      RemoteConfigUtils.registerConfigEnv(configEnv);

      expect(RemoteConfigUtils.writeFileSync).toHaveBeenCalledWith(
        'remote-envs/DX-DeveloperExperience/git-webhooks/config.env',
        `gitApi=https://gitapi.com\ngitToken=azertyuiop`,
      );
    });
  });
});
