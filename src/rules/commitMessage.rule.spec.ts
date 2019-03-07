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
import { CommitMessageRule } from './commitMessage.rule';
import { GitEventEnum, GitTypeEnum } from '../webhook/utils.enum';

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
    it('should return true + an array of sha, matches and message ', () => {
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
      };
      webhook.commits = [
        {
          message: 'fix: readme (#12)',
          id: '1',
        },
        {
          message: 'feat(test): tdd (#34)',
          id: '2',
        },
        {
          message: 'docs: gh-pages',
          id: '3',
        },
      ];
      const commitMessage = new CommitMessageRule();
      commitMessage.options = {
        regexp:
          '(feat|fix|docs)(\\([a-z]+\\))?:\\s[^(]*(\\(#[1-9][0-9]*(?:, #[1-9][0-9]*)*\\))?$',
      };

      jest.spyOn(commitMessage, 'validate');

      const result: RuleResult = commitMessage.validate(webhook, commitMessage);
      const expectedResult = {
        branch: 'test_webhook',
        commits: [
          {
            sha: '1',
            message: 'fix: readme (#12)',
            matches: ['fix: readme (#12)', 'fix', undefined, '(#12)'],
          },
          {
            sha: '2',
            message: 'feat(test): tdd (#34)',
            matches: ['feat(test): tdd (#34)', 'feat', '(test)', '(#34)'],
          },
          {
            sha: '3',
            message: 'docs: gh-pages',
            matches: ['docs: gh-pages', 'docs', undefined, undefined],
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
    it('should return false + an array of sha, matches and message ', () => {
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
      };
      webhook.commits = [
        {
          message: 'update: readme (#12)',
          id: '1',
        },
        {
          message: 'feat(test): tdd (#34)',
          id: '2',
        },
        {
          message: 'docs: gh-pages',
          id: '3',
        },
      ];
      const commitMessage = new CommitMessageRule();
      commitMessage.options = {
        regexp:
          '(feat|fix|docs)(\\([a-z]+\\))?:\\s[^(]*(\\(#[1-9][0-9]*(?:, #[1-9][0-9]*)*\\))?$',
      };

      jest.spyOn(commitMessage, 'validate');

      const result: RuleResult = commitMessage.validate(webhook, commitMessage);
      expect(result.validated).toBe(false);
    });
  });
});