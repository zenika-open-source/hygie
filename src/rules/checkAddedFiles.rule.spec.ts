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
  MockAnalytics,
} from '../__mocks__/mocks';
import { GitEventEnum, GitTypeEnum } from '../webhook/utils.enum';
import { CheckAddedFilesRule } from './checkAddedFiles.rule';

describe('RulesService', () => {
  let app: TestingModule;
  let githubService: GithubService;
  let gitlabService: GitlabService;
  let webhook: Webhook;

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
    webhook.branchName = 'test_branch';
    webhook.repository = {
      fullName: 'bastienterrier/test_webhook',
      name: 'test_webhook',
      description: 'amazing project',
      cloneURL: 'https://github.com/bastienterrier/test-webhook.git',
      defaultBranchName: 'master',
    };
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('checkAddFiles Rule', () => {
    it('should return false and an empty array', async () => {
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
      const checkAddedFilesRule = new CheckAddedFilesRule(MockAnalytics);
      checkAddedFilesRule.options = {
        regexp: '.*\\.md$',
      };

      jest.spyOn(checkAddedFilesRule, 'validate');

      const result: RuleResult = await checkAddedFilesRule.validate(
        webhook,
        checkAddedFilesRule,
      );
      expect(result.validated).toBe(false);
      expect(result.data.addedFiles).toEqual([]);
    });
  });

  describe('checkAddFiles Rule', () => {
    it('should return true and an array with matching files', async () => {
      webhook.commits = [
        {
          message: 'fix: readme (#12)',
          sha: '1',
          added: ['a.md', 'b.md', 'c.exe', 'd.bat', 'e.md'],
        },
        {
          message: 'feat(test): tdd (#34)',
          sha: '2',
        },
        {
          message: 'docs: gh-pages',
          sha: '3',
          added: ['aa.md', 'bb.md', 'cc.exe', 'dd.bat', 'ee.md'],
        },
      ];
      const checkAddedFilesRule = new CheckAddedFilesRule(MockAnalytics);
      checkAddedFilesRule.options = {
        regexp: '.*\\.md$',
      };

      jest.spyOn(checkAddedFilesRule, 'validate');

      const result: RuleResult = await checkAddedFilesRule.validate(
        webhook,
        checkAddedFilesRule,
      );

      expect(result.validated).toBe(true);
      expect(result.data.addedFiles).toEqual(['a.md', 'b.md', 'e.md', 'aa.md', 'bb.md', 'ee.md']);
    });
  });
});
