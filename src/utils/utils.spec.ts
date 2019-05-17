import { Utils } from './utils';
import { GitTypeEnum } from '../webhook/utils.enum';
import { TestingModule, Test } from '@nestjs/testing';
import { DataAccessService } from '../data_access/dataAccess.service';
import { MockDataAccessService } from '../__mocks__/mocks';
let app: TestingModule;

let dataAccessService: DataAccessService;
beforeAll(async () => {
  app = await Test.createTestingModule({
    providers: [
      { provide: DataAccessService, useClass: MockDataAccessService },
    ],
  }).compile();
  dataAccessService = app.get(DataAccessService);
});

describe('Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loadEnv', () => {
    it('should call fs', async () => {
      dataAccessService.readEnv = jest.fn().mockReturnValue({
        gitApi: 'https://gitapi.com',
        gitToken: 'myToken',
      });

      await Utils.loadEnv(dataAccessService, 'myFilePath');

      expect(process.env.gitApi).toBe('https://gitapi.com');
      expect(process.env.gitToken).toBe('myToken');
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

  describe('JSONtoString', () => {
    it('should return "gitApi=myAPI\ngitToken=myToken', () => {
      expect(
        Utils.JSONtoString({
          gitApi: 'myAPI',
          gitToken: 'myToken',
        }),
      ).toBe('gitApi=myAPI\ngitToken=myToken');
    });
    it('should return "gitApi=myAPI\ngitToken=myToken', () => {
      expect(Utils.JSONtoString('gitApi=myAPI\ngitToken=myToken')).toBe(
        'gitApi=myAPI\ngitToken=myToken',
      );
    });
  });

  describe('StringtoJSON', () => {
    it('should return a JSON object', () => {
      expect(Utils.StringtoJSON('gitApi=myAPI\ngitToken=myToken')).toEqual({
        gitApi: 'myAPI',
        gitToken: 'myToken',
      });
    });
    it('should return a JSON object', () => {
      expect(
        Utils.StringtoJSON({
          gitApi: 'myAPI',
          gitToken: 'myToken',
        }),
      ).toEqual({
        gitApi: 'myAPI',
        gitToken: 'myToken',
      });
    });
  });
});
