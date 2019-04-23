import { Utils } from './utils';
import { GitTypeEnum } from '../webhook/utils.enum';

describe('Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loadEnv', () => {
    it('should call fs', () => {
      const fs = require('fs');
      jest.mock('fs');

      fs.readFileSync.mockReturnValue(
        `gitApi=https://gitapi.com
gitToken=azertyuiop`,
      );

      Utils.loadEnv('myFilePath');

      expect(process.env.gitApi).toBe('https://gitapi.com');
      expect(process.env.gitToken).toBe('azertyuiop');
    });
  });

  describe('getObjectValue', () => {
    it('should return {}', () => {
      const test: any = {};
      expect(Utils.getObjectValue(test.key)).toEqual({});
    });
    it('should return the object', () => {
      const test: any = {
        key: {
          key1: 'value1',
        },
      };
      expect(Utils.getObjectValue(test.key)).toEqual({
        key1: 'value1',
      });
    });
  });

  describe('getStringValue', () => {
    it('should return ""', () => {
      const test: any = {};
      expect(Utils.getStringValue(test.key)).toBe('');
    });
    it('should return the string value', () => {
      const test: any = {
        key: 'value',
      };
      expect(Utils.getStringValue(test.key)).toBe('value');
    });
  });

  describe('whichGitType', () => {
    it('should return "Github"', () => {
      expect(
        Utils.whichGitType('https://github.com/bastienterrier/test-webhook'),
      ).toBe(GitTypeEnum.Github);
    });
    it('should return "Gitlab"', () => {
      expect(
        Utils.whichGitType('https://gitlab.com/bastien.terrier/test_webhook'),
      ).toBe(GitTypeEnum.Gitlab);
    });
    it('should return "Undifined"', () => {
      expect(Utils.whichGitType('https://google.com')).toBe(
        GitTypeEnum.Undefined,
      );
    });
  });

  describe('getRepositoryFullName', () => {
    it('should return "DX-DeveloperExperience/git-webhooks"', () => {
      expect(
        Utils.getRepositoryFullName(
          'https://github.com/DX-DeveloperExperience/git-webhooks',
        ),
      ).toBe('DX-DeveloperExperience/git-webhooks');
    });
  });

  /*
  describe('writeFileSync', () => {
    it('should do something', () => {
      const fs = require('fs');
      const path = require('path');
      jest.clearAllMocks();
      fs.promises.mkdir = jest.fn().mockImplementation(() => {
        return Promise.resolve('ok');
      });
      fs.writeFileSync = jest.fn();

      jest.mock('path');
      Utils.writeFileSync('myFile.txt', 'my content...');
      expect(fs.promises.mkdir).toBeCalledTimes(1);
      expect(fs.writeFileSync).toBeCalledTimes(1);
    });
  });*/
});
