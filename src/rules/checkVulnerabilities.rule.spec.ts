import { Test, TestingModule } from '@nestjs/testing';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { Webhook } from '../webhook/webhook';
import { HttpService } from '@nestjs/common';
import {
  MockHttpService,
  MockGitlabService,
  MockGithubService,
} from '../__mocks__/mocks';
import { GitEventEnum, GitTypeEnum } from '../webhook/utils.enum';
import { CheckVulnerabilitiesRule } from './checkVulnerabilities.rule';
import { RuleResult } from './ruleResult';

describe('RulesService', () => {
  let app: TestingModule;
  let githubService: GithubService;
  let gitlabService: GitlabService;

  const download = require('download');
  jest.mock('download');

  const execa = require('execa');

  let webhook: Webhook;
  let checkVulnerabilitiesRule: CheckVulnerabilitiesRule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        { provide: HttpService, useClass: MockHttpService },
        { provide: GitlabService, useClass: MockGitlabService },
        { provide: GithubService, useClass: MockGithubService },
      ],
    }).compile();

    githubService = app.get(GithubService);
    gitlabService = app.get(GitlabService);

    webhook = new Webhook(gitlabService, githubService);
    webhook.gitEvent = GitEventEnum.Push;
    webhook.gitService = githubService;
    webhook.gitType = GitTypeEnum.Github;
    webhook.projectId = 1;
    webhook.branchName = 'test_webhook';
    webhook.repository = {
      fullName: 'bastienterrier/test_webhook',
      name: 'test_webhook',
      description: 'amazing project',
      cloneURL: 'https://github.com/bastienterrier/test-webhook.git',
      defaultBranchName: 'master',
    };
    webhook.commits = [
      {
        message: 'fix: readme (#12)',
        sha: '1',
      },
      {
        message: 'feat(test): tdd (#34)',
        sha: '2',
      },
      {
        message: 'docs: gh-pages',
        sha: '3',
      },
    ];
    checkVulnerabilitiesRule = new CheckVulnerabilitiesRule();
    checkVulnerabilitiesRule.options = {
      packageUrl:
        'https://raw.githubusercontent.com/DX-DeveloperExperience/git-webhooks/master/package.json',
      packageLockUrl:
        'https://raw.githubusercontent.com/DX-DeveloperExperience/git-webhooks/master/package-lock.json',
    };
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // CheckVulnerabilities Rule
  describe('checkVulnerabilities Rule', () => {
    it('should call the download() twice and result.validated to be true', async () => {
      jest.spyOn(checkVulnerabilitiesRule, 'validate');

      execa.shellSync = jest.fn().mockImplementationOnce(() => {
        return {
          stdout: `{}`,
        };
      });

      const result: RuleResult = await checkVulnerabilitiesRule.validate(
        webhook,
        checkVulnerabilitiesRule,
      );

      expect(download).toBeCalledTimes(2);
      expect(result.validated).toBe(true);
      expect(result.data).toEqual({ vulnerabilities: {} });
    });
  });

  describe('getNumberOfVulnerabilities', () => {
    it('should return 17', () => {
      const data = {
        metadata: {
          vulnerabilities: {
            info: 0,
            low: 1,
            moderate: 2,
            high: 14,
            critical: 0,
          },
        },
      };
      expect(checkVulnerabilitiesRule.getNumberOfVulnerabilities(data)).toBe(
        17,
      );
    });
  });
});
