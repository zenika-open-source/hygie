import { Utils } from './utils';
import { GitTypeEnum } from '../webhook/utils.enum';
import { TestingModule, Test } from '@nestjs/testing';
import { DataAccessService } from '../data_access/dataAccess.service';
import { MockDataAccessService } from '../__mocks__/mocks';
import { GitEnv } from '../git/gitEnv.interface';
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

  describe('transformToArray', () => {
    it('should return ["a", "b", "c"]', () => {
      expect(Utils.transformToArray('a,b,c', {})).toEqual(['a', 'b', 'c']);
    });
    it('should return ["a", "b", "c"]', () => {
      expect(Utils.transformToArray(['a', 'b', 'c'], {})).toEqual([
        'a',
        'b',
        'c',
      ]);
    });
    it('should return ["a", "b", "c"]', () => {
      expect(
        Utils.transformToArray(
          '{{data.a}}-{{data.b}}-{{data.c}}',
          {
            data: {
              a: 'a',
              b: 'b',
              c: 'c',
            },
          },
          '-',
        ),
      ).toEqual(['a', 'b', 'c']);
    });
    it('should return ["a", "b", "c"]', () => {
      expect(
        Utils.transformToArray(['{{data.a}}', '{{data.b}}', '{{data.c}}'], {
          data: {
            a: 'a',
            b: 'b',
            c: 'c',
          },
        }),
      ).toEqual(['a', 'b', 'c']);
    });
  });

  describe('getGitEnv', () => {
    it('should return a GitEnv object', async () => {
      dataAccessService.readEnv = jest.fn().mockReturnValue({
        gitApi: 'https://gitapi.com',
        gitToken: 'myToken',
      });

      const result: GitEnv = await Utils.getGitEnv(
        dataAccessService,
        'myFilePath',
      );

      expect(result).toEqual({
        gitApi: 'https://gitapi.com',
        gitToken: 'myToken',
      });
    });
  });

  describe('getGitEnv', () => {
    it('should throw an error', async () => {
      dataAccessService.readEnv = jest.fn().mockReturnValue({});
      try {
        await Utils.getGitEnv(dataAccessService, 'myFilePath');
      } catch (e) {
        expect(e).toEqual('envData object has empty properties');
      }
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
    it('should return "DX-DeveloperExperience/hygie"', () => {
      expect(
        Utils.getRepositoryFullName(
          'https://github.com/DX-DeveloperExperience/hygie',
        ),
      ).toBe('DX-DeveloperExperience/hygie');
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

  describe('generateUniqueId', () => {
    it('shoud return two differents ids', () => {
      const id1 = Utils.generateUniqueId();
      const id2 = Utils.generateUniqueId();
      expect(id1).not.toBe(id2);
    });
  });

  describe('encryptToken & decryptToken', () => {
    it('shoud encrypt the plain text and retrieve it', () => {
      process.env.ENCRYPTION_KEY = 'somekey';
      const original = 'hello, world!';
      const encrypt = Utils.encryptToken(original);
      const decrypt = Utils.decryptToken(encrypt);
      expect(decrypt).toBe(original);
    });
  });

  describe('splitDirectoryPath', () => {
    it('shoud return two paths', () => {
      const { base, name } = Utils.splitDirectoryPath(
        'docs/getting_started/steps',
      );
      expect(base).toBe('docs/getting_started');
      expect(name).toBe('steps');
    });
    it('shoud return two paths', () => {
      const { base, name } = Utils.splitDirectoryPath('docs');
      expect(base).toBe('');
      expect(name).toBe('docs');
    });
  });

  describe('getTypeAndMode', () => {
    it('shoud return tree', () => {
      const result = Utils.getTypeAndMode('dir');
      expect(result).toEqual({ type: 'tree', mode: '040000' });
    });
    it('shoud return blob', () => {
      const result = Utils.getTypeAndMode('file');
      expect(result).toEqual({ type: 'blob', mode: '100644' });
    });
    it('shoud return nothing', () => {
      const result = Utils.getTypeAndMode('');
      expect(result).toEqual({});
    });
  });

  // tslint:disable:max-line-length
  describe('parseRuleFile', () => {
    it('shoud return a YAML parsed rules object', async () => {
      const yamlFile: any = `---
      groups:
      - groupName: check pattern 1
        onBoth:
        - args:
            message: blablabla...
          callback: LoggerRunnable
        - args:
            data:
              message: 'data : {{#data}}- {{name}} -{{/data}}'
            url: https://webhook.site/0de43177-4119-448b-bcfe-e2f6a2845ce8
          callback: WebhookRunnable
        rules:
        - name: commitMessage
          options:
            regexp: "(feat|fix):s.*"
        - name: oneCommitPerPR
        - name: branchName
          options:
            regex: feature/.*
      options:
        allRuleResultInOne: true
        enableGroups: false
        enableRules: true
        executeAllRules: false
      rules:
      - name: commitMessage
        onBoth:
        - args:
            failDescriptionMessage: NOOOT good...
            failTargetUrl: http://moogle.com/
            successDescriptionMessage: good commit status!
            successTargetUrl: http://www.google.com
          callback: UpdateCommitStatusRunnable
        onError:
        - args:
            message: 'pattern does not match, commit name must begin with : feat|fix|docs
              and contains less than 100 numerals! Check your commit message: {{#data.commits}}
              > {{message.commits}} (#{{sha}}) {{/data.commits}} '
          callback: LoggerRunnable
        onSuccess:
        - args:
            message: 'pattern match: branch: {{data.branch}} {{#data.commits}}{{sha}} =
              {{matches.1}} | Scope: {{matches.2}} | Issue: {{matches.3}} {{/data.commits}}'
          callback: LoggerRunnable
        - args:
            data:
              content: "{{#data.commits}}{{sha}} = {{matches.1}} | Scope: {{matches.2}}
                | Issue: {{matches.3}} {{/data.commits}}"
              user: bastien terrier
            url: https://webhook.site/0de43177-4119-448b-bcfe-e2f6a2845ce8
          callback: WebhookRunnable
        options:
          maxLength: 100
          regexp: "(feat|fix|docs)(([a-z]+))?:s[^(]*((#[1-9][0-9]*(?:, #[1-9][0-9]*)*))?$"
      `;

      const expectedResult = {
        groups: [
          {
            groupName: 'check pattern 1',
            onBoth: [
              {
                args: {
                  message: 'blablabla...',
                },
                callback: 'LoggerRunnable',
              },
              {
                args: {
                  data: {
                    message: 'data : {{#data}}- {{name}} -{{/data}}',
                  },
                  url:
                    'https://webhook.site/0de43177-4119-448b-bcfe-e2f6a2845ce8',
                },
                callback: 'WebhookRunnable',
              },
            ],
            rules: [
              {
                name: 'commitMessage',
                options: {
                  regexp: '(feat|fix):s.*',
                },
              },
              {
                name: 'oneCommitPerPR',
              },
              {
                name: 'branchName',
                options: {
                  regex: 'feature/.*',
                },
              },
            ],
          },
        ],
        options: {
          allRuleResultInOne: true,
          enableGroups: false,
          enableRules: true,
          executeAllRules: false,
        },
        rules: [
          {
            name: 'commitMessage',
            onBoth: [
              {
                args: {
                  failDescriptionMessage: 'NOOOT good...',
                  failTargetUrl: 'http://moogle.com/',
                  successDescriptionMessage: 'good commit status!',
                  successTargetUrl: 'http://www.google.com',
                },
                callback: 'UpdateCommitStatusRunnable',
              },
            ],
            onError: [
              {
                args: {
                  message:
                    'pattern does not match, commit name must begin with : feat|fix|docs and contains less than 100 numerals! Check your commit message: {{#data.commits}} > {{message.commits}} (#{{sha}}) {{/data.commits}} ',
                },
                callback: 'LoggerRunnable',
              },
            ],
            onSuccess: [
              {
                args: {
                  message:
                    'pattern match: branch: {{data.branch}} {{#data.commits}}{{sha}} = {{matches.1}} | Scope: {{matches.2}} | Issue: {{matches.3}} {{/data.commits}}',
                },
                callback: 'LoggerRunnable',
              },
              {
                args: {
                  data: {
                    content:
                      '{{#data.commits}}{{sha}} = {{matches.1}} | Scope: {{matches.2}} | Issue: {{matches.3}} {{/data.commits}}',
                    user: 'bastien terrier',
                  },
                  url:
                    'https://webhook.site/0de43177-4119-448b-bcfe-e2f6a2845ce8',
                },
                callback: 'WebhookRunnable',
              },
            ],
            options: {
              maxLength: 100,
              regexp:
                '(feat|fix|docs)(([a-z]+))?:s[^(]*((#[1-9][0-9]*(?:, #[1-9][0-9]*)*))?$',
            },
          },
        ],
      };

      const parsedYAML = await Utils.parseRuleFile(yamlFile);
      expect(parsedYAML).toEqual(expectedResult);
    });
    it('shoud return a JSON parsed rules object', async () => {
      const jsonFile: any = `{
        "options": {
          "executeAllRules": false,
          "enableGroups": false,
          "enableRules": true,
          "allRuleResultInOne": true
        },
        "rules": [
          {
            "name": "commitMessage",
            "options": {
              "regexp": "(feat|fix|docs)(\([a-z]+\))?:\s[^(]*(\(#[1-9][0-9]*(?:, #[1-9][0-9]*)*\))?$",
              "maxLength": 100
            },
            "onSuccess": [
              {
                "callback": "LoggerRunnable",
                "args": {
                  "message": "pattern match: branch: {{data.branch}} {{#data.commits}}{{sha}} = {{matches.1}} | Scope: {{matches.2}} | Issue: {{matches.3}} {{/data.commits}}"
                }
              },
              {
                "callback": "WebhookRunnable",
                "args": {
                  "url": "https://webhook.site/0de43177-4119-448b-bcfe-e2f6a2845ce8",
                  "data": {
                    "user": "bastien terrier",
                    "content": "{{#data.commits}}{{sha}} = {{matches.1}} | Scope: {{matches.2}} | Issue: {{matches.3}} {{/data.commits}}"
                  }
                }
              }
            ],
            "onError": [
              {
                "callback": "LoggerRunnable",
                "args": {
                  "message": "pattern does not match, commit name must begin with : feat|fix|docs and contains less than 100 numerals! Check your commit message: {{#data.commits}} > {{message.commits}} (#{{sha}}) {{/data.commits}} "
                }
              }
            ],
            "onBoth": [
              {
                "callback": "UpdateCommitStatusRunnable",
                "args": {
                  "successTargetUrl": "http://www.google.com",
                  "failTargetUrl": "http://moogle.com/",
                  "successDescriptionMessage": "good commit status!",
                  "failDescriptionMessage": "NOOOT good..."
                }
              }
            ]
          }
        ],
        "groups": [
          {
            "groupName": "check pattern 1",
            "rules": [
              {
                "name": "commitMessage",
                "options": {
                  "regexp": "(feat|fix):\s.*"
                }
              },
              {
                "name": "oneCommitPerPR"
              },
              {
                "name": "branchName",
                "options": {
                  "regex": "feature/.*"
                }
              }
            ],
            "onBoth": [
              {
                "callback": "LoggerRunnable",
                "args": {
                  "message": "blablabla..."
                }
              },
              {
                "callback": "WebhookRunnable",
                "args": {
                  "url": "https://webhook.site/0de43177-4119-448b-bcfe-e2f6a2845ce8",
                  "data": {
                    "message": "data : {{#data}}- {{name}} -{{/data}}"
                  }
                }
              }
            ]
          }
        ]
      }
      `;

      const expectedResult = {
        groups: [
          {
            groupName: 'check pattern 1',
            onBoth: [
              {
                args: {
                  message: 'blablabla...',
                },
                callback: 'LoggerRunnable',
              },
              {
                args: {
                  data: {
                    message: 'data : {{#data}}- {{name}} -{{/data}}',
                  },
                  url:
                    'https://webhook.site/0de43177-4119-448b-bcfe-e2f6a2845ce8',
                },
                callback: 'WebhookRunnable',
              },
            ],
            rules: [
              {
                name: 'commitMessage',
                options: {
                  regexp: '(feat|fix):s.*',
                },
              },
              {
                name: 'oneCommitPerPR',
              },
              {
                name: 'branchName',
                options: {
                  regex: 'feature/.*',
                },
              },
            ],
          },
        ],
        options: {
          allRuleResultInOne: true,
          enableGroups: false,
          enableRules: true,
          executeAllRules: false,
        },
        rules: [
          {
            name: 'commitMessage',
            onBoth: [
              {
                args: {
                  failDescriptionMessage: 'NOOOT good...',
                  failTargetUrl: 'http://moogle.com/',
                  successDescriptionMessage: 'good commit status!',
                  successTargetUrl: 'http://www.google.com',
                },
                callback: 'UpdateCommitStatusRunnable',
              },
            ],
            onError: [
              {
                args: {
                  message:
                    'pattern does not match, commit name must begin with : feat|fix|docs and contains less than 100 numerals! Check your commit message: {{#data.commits}} > {{message.commits}} (#{{sha}}) {{/data.commits}} ',
                },
                callback: 'LoggerRunnable',
              },
            ],
            onSuccess: [
              {
                args: {
                  message:
                    'pattern match: branch: {{data.branch}} {{#data.commits}}{{sha}} = {{matches.1}} | Scope: {{matches.2}} | Issue: {{matches.3}} {{/data.commits}}',
                },
                callback: 'LoggerRunnable',
              },
              {
                args: {
                  data: {
                    content:
                      '{{#data.commits}}{{sha}} = {{matches.1}} | Scope: {{matches.2}} | Issue: {{matches.3}} {{/data.commits}}',
                    user: 'bastien terrier',
                  },
                  url:
                    'https://webhook.site/0de43177-4119-448b-bcfe-e2f6a2845ce8',
                },
                callback: 'WebhookRunnable',
              },
            ],
            options: {
              maxLength: 100,
              regexp:
                '(feat|fix|docs)(([a-z]+))?:s[^(]*((#[1-9][0-9]*(?:, #[1-9][0-9]*)*))?$',
            },
          },
        ],
      };

      const parsedJSON = await Utils.parseRuleFile(jsonFile);
      expect(parsedJSON).toEqual(expectedResult);
    });
  });
});
