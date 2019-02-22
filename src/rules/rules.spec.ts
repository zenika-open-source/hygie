import { Test, TestingModule } from '@nestjs/testing';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { Webhook } from '../webhook/webhook';
import { RuleResult } from '../rules/ruleResult';
import { RulesService } from './rules.service';
import { BranchNameRule } from './branchName.rule';
import { HttpService, HttpModule } from '@nestjs/common';
import {
  MockHttpService,
  MockGitlabService,
  MockGithubService,
} from '../__mocks__/mocks';
import { CommitMessageRule } from './commitMessage.rule';
import { GitEventEnum, GitTypeEnum } from '../webhook/utils.enum';
import { IssueTitleRule } from './issueTitle.rule';
import { OneCommitPerPRRule } from './oneCommitPerPR.rule';

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

  // BrancheName Rule
  describe('branchName Rule', () => {
    it('should return true', () => {
      const webhook = new Webhook(gitlabService, githubService);
      webhook.branchName = 'features/tdd';
      const branchName = new BranchNameRule(webhook);
      branchName.options = {
        regexp: '(features|fix)\\/.*',
      };
      jest.spyOn(branchName, 'validate');

      const result: RuleResult = branchName.validate();
      expect(result.validated).toBe(true);
      expect(result.data).toEqual({
        branch: 'features/tdd',
      });
    });
  });
  describe('branchName Rule', () => {
    it('should return false', () => {
      const webhook = new Webhook(gitlabService, githubService);
      webhook.branchName = 'testing/tdd';
      const branchName = new BranchNameRule(webhook);
      branchName.options = {
        regexp: '(features|fix)\\/.*',
      };
      jest.spyOn(branchName, 'validate');

      const result: RuleResult = branchName.validate();
      expect(result.validated).toBe(false);
      expect(result.data).toEqual({
        branch: 'testing/tdd',
      });
    });
  });

  // CommitMessage Rule
  describe('commitMessage Rule', () => {
    it('should return true + an array of sha, matches and message ', () => {
      const webhook = new Webhook(gitlabService, githubService);
      webhook.gitEvent = GitEventEnum.Push;
      webhook.gitService = githubService;
      webhook.gitType = GitTypeEnum.Github;
      webhook.projectId = 1;
      webhook.repository = {
        fullName: 'bastienterrier/test_webhook',
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
      const commitMessage = new CommitMessageRule(webhook);
      commitMessage.options = {
        regexp:
          '(feat|fix|docs)(\\([a-z]+\\))?:\\s[^(]*(\\(#[1-9][0-9]*(?:, #[1-9][0-9]*)*\\))?$',
      };

      jest.spyOn(commitMessage, 'validate');

      const result: RuleResult = commitMessage.validate();
      const expectedResult = [
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
      ];
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
      webhook.repository = {
        fullName: 'bastienterrier/test_webhook',
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
      const commitMessage = new CommitMessageRule(webhook);
      commitMessage.options = {
        regexp:
          '(feat|fix|docs)(\\([a-z]+\\))?:\\s[^(]*(\\(#[1-9][0-9]*(?:, #[1-9][0-9]*)*\\))?$',
      };

      jest.spyOn(commitMessage, 'validate');

      const result: RuleResult = commitMessage.validate();
      expect(result.validated).toBe(false);
    });
  });

  // IssueTitle Rule
  describe('issueTitle Rule', () => {
    it('should return true + an object with issueTitle, git, issueNumber and gitApiInfos', () => {
      const webhook = new Webhook(gitlabService, githubService);
      webhook.gitType = GitTypeEnum.Github;
      webhook.issue.number = 22;
      webhook.issue.title = 'add rules documentation';
      webhook.repository = {
        fullName: 'bastienterrier/test_webhook',
      };

      const issueTitle = new IssueTitleRule(webhook);
      issueTitle.options = {
        regexp: '(add|fix)\\s.*',
      };

      jest.spyOn(issueTitle, 'validate');

      const result: RuleResult = issueTitle.validate();
      const expectedResult = {
        issueTitle: 'add rules documentation',
        git: 'Github',
        gitApiInfos: {
          repositoryFullName: 'bastienterrier/test_webhook',
        },
        issueNumber: 22,
      };
      expect(result.validated).toBe(true);
      expect(result.data).toEqual(expectedResult);
    });
  });
  describe('issueTitle Rule', () => {
    it('should return false + an object with issueTitle, git, issueNumber and gitApiInfos', () => {
      const webhook = new Webhook(gitlabService, githubService);
      webhook.gitType = GitTypeEnum.Gitlab;
      webhook.issue.number = 42;
      webhook.issue.title = 'update rules documentation';
      webhook.projectId = 7657;

      const issueTitle = new IssueTitleRule(webhook);
      issueTitle.options = {
        regexp: '(add|fix)\\s.*',
      };

      jest.spyOn(issueTitle, 'validate');

      const result: RuleResult = issueTitle.validate();
      const expectedResult = {
        issueTitle: 'update rules documentation',
        git: 'Gitlab',
        gitApiInfos: {
          projectId: '7657',
        },
        issueNumber: 42,
      };
      expect(result.validated).toBe(false);
      expect(result.data).toEqual(expectedResult);
    });
  });

  // OneCommitPerPR Rule
  describe('oneCommitPerPR Rule', () => {
    it('should return false', () => {
      const webhook = new Webhook(gitlabService, githubService);
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
      const oneCommitPerPR = new OneCommitPerPRRule(webhook);
      jest.spyOn(oneCommitPerPR, 'validate');

      const result: RuleResult = oneCommitPerPR.validate();
      expect(result.validated).toBe(false);
      expect((result.data as any).commits).toEqual(webhook.commits);
    });
  });
  describe('oneCommitPerPR Rule', () => {
    it('should return true', () => {
      const webhook = new Webhook(gitlabService, githubService);
      webhook.commits = [
        {
          message: 'fix: readme (#12)',
          id: '1',
        },
      ];
      const oneCommitPerPR = new OneCommitPerPRRule(webhook);
      jest.spyOn(oneCommitPerPR, 'validate');

      const result: RuleResult = oneCommitPerPR.validate();
      expect(result.validated).toBe(true);
      expect((result.data as any).commits).toEqual(webhook.commits);
    });
  });
});
