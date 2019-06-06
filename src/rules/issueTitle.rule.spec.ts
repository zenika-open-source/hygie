import { Test, TestingModule } from '@nestjs/testing';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { Webhook } from '../webhook/webhook';
import { RuleResult } from '../rules/ruleResult';
import { HttpService } from '@nestjs/common';
import {
  MockHttpService,
  MockGitlabService,
  MockGithubService,
} from '../__mocks__/mocks';
import { GitTypeEnum } from '../webhook/utils.enum';
import { IssueTitleRule } from './issueTitle.rule';

describe('RulesService', () => {
  let app: TestingModule;
  let githubService: GithubService;
  let gitlabService: GitlabService;

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
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // IssueTitle Rule
  describe('issueTitle Rule', () => {
    it('should return true + an object with issueTitle, git, issueNumber and gitApiInfos', async () => {
      const webhook = new Webhook(gitlabService, githubService);
      webhook.gitType = GitTypeEnum.Github;
      webhook.issue.number = 22;
      webhook.issue.title = 'add rules documentation';
      webhook.repository = {
        fullName: 'bastienterrier/test_webhook',
        name: 'test_webhook',
        description: 'amazing project',
        cloneURL: 'https://github.com/bastienterrier/test-webhook.git',
        defaultBranchName: 'master',
      };

      const issueTitle = new IssueTitleRule();
      issueTitle.options = {
        regexp: '(add|fix)\\s.*',
      };

      jest.spyOn(issueTitle, 'validate');

      const result: RuleResult = await issueTitle.validate(webhook, issueTitle);
      const expectedResult = {
        issueTitle: 'add rules documentation',
        issueNumber: 22,
        matches: ['add rules documentation', 'add'],
      };
      expect(result.validated).toBe(true);
      expect(JSON.parse(JSON.stringify(result.data))).toEqual(expectedResult);
      expect(result.gitApiInfos).toEqual({
        git: 'Github',
        repositoryFullName: 'bastienterrier/test_webhook',
      });
    });
  });
  describe('issueTitle Rule', () => {
    it('should return false + an object with issueTitle, git, issueNumber and gitApiInfos', async () => {
      const webhook = new Webhook(gitlabService, githubService);
      webhook.gitType = GitTypeEnum.Gitlab;
      webhook.issue.number = 42;
      webhook.issue.title = 'update rules documentation';
      webhook.projectId = 7657;

      const issueTitle = new IssueTitleRule();
      issueTitle.options = {
        regexp: '(add|fix)\\s.*',
      };

      jest.spyOn(issueTitle, 'validate');

      const result: RuleResult = await issueTitle.validate(webhook, issueTitle);
      const expectedResult = {
        issueTitle: 'update rules documentation',
        issueNumber: 42,
        matches: null,
      };
      expect(result.validated).toBe(false);
      expect(result.data).toEqual(expectedResult);
      expect(result.gitApiInfos).toEqual({
        git: 'Gitlab',
        projectId: '7657',
      });
    });
  });
});
