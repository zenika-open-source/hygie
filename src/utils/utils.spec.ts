import { Utils } from './utils';

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
