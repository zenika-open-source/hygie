import { Test, TestingModule } from '@nestjs/testing';
import { GithubService } from '../../src/github/github.service';
import { GitlabService } from '../../src/gitlab/gitlab.service';
import { Webhook } from '../../src/webhook/webhook';
import { RuleResult } from '../../src/rules/ruleResult';
import { HttpService } from '@nestjs/common';
import {
  MockHttpService,
  MockGitlabService,
  MockGithubService,
  MockAnalytics,
} from '../../src/__mocks__/mocks';
import { CommitMessageRule } from '../../src/rules/commitMessage.rule';
import { GitEventEnum, GitTypeEnum } from '../../src/webhook/utils.enum';

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

  // CommitMessage Rule
  describe('commitMessage Rule', () => {
    it('should return true + an array of sha, matches and message ', async () => {
      const webhook = new Webhook(gitlabService, githubService);
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
      const commitMessage = new CommitMessageRule(MockAnalytics);
      commitMessage.options = {
        regexp:
          '(feat|fix|docs)(\\([a-z]+\\))?:\\s[^(]*(\\(#[1-9][0-9]*(?:, #[1-9][0-9]*)*\\))?$',
        maxLength: 100,
      };

      jest.spyOn(commitMessage, 'validate');

      const result: RuleResult = await commitMessage.validate(
        webhook,
        commitMessage,
      );
      const expectedResult = {
        branch: 'test_webhook',
        commits: [
          {
            status: 'Success',
            success: true,
            sha: '1',
            message: 'fix: readme (#12)',
            matches: ['fix: readme (#12)', 'fix', null, '(#12)'],
          },
          {
            status: 'Success',
            success: true,
            sha: '2',
            message: 'feat(test): tdd (#34)',
            matches: ['feat(test): tdd (#34)', 'feat', '(test)', '(#34)'],
          },
          {
            status: 'Success',
            success: true,
            sha: '3',
            message: 'docs: gh-pages',
            matches: ['docs: gh-pages', 'docs', null, null],
          },
        ],
      };
      expect(result.validated).toBe(true);
      expect(JSON.stringify(result.data)).toEqual(
        JSON.stringify(expectedResult),
      ); // JSON.stringify needed : https://github.com/facebook/jest/issues/5998
    });
  });
  describe('commitMessage Rule', () => {
    it('should return false + an array of sha, matches and message ', async () => {
      const webhook = new Webhook(gitlabService, githubService);
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
          message: 'update: readme (#12)',
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
      const commitMessage = new CommitMessageRule(MockAnalytics);
      commitMessage.options = {
        regexp:
          '(feat|fix|docs)(\\([a-z]+\\))?:\\s[^(]*(\\(#[1-9][0-9]*(?:, #[1-9][0-9]*)*\\))?$',
        maxLength: 100,
      };

      jest.spyOn(commitMessage, 'validate');

      const result: RuleResult = await commitMessage.validate(
        webhook,
        commitMessage,
      );
      expect(result.validated).toBe(false);
    });
  });
});
