import { Webhook, WebhookCommit } from './webhook';
import { GitlabService } from '../gitlab/gitlab.service';
import { GithubService } from '../github/github.service';
import { HttpService } from '@nestjs/common';
import { GitEventEnum, GitTypeEnum } from './utils.enum';

// INIT
const gitlabService: GitlabService = new GitlabService(new HttpService());
const githubService: GithubService = new GithubService(new HttpService());
const webhook = new Webhook(gitlabService, githubService);
webhook.branchName = 'features/fix';
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
webhook.gitEvent = GitEventEnum.NewBranch;
webhook.gitService = githubService;
webhook.gitType = GitTypeEnum.Github;
webhook.projectId = 1;
webhook.repository = {
  fullName: 'bastienterrier/test_webhook',
  name: 'test_webhook',
  description: 'amazing project',
  cloneURL: 'https://github.com/bastienterrier/test-webhook.git',
};
webhook.pullRequest = {
  title: 'my PR for webhook',
  description: 'my desc',
  number: 22,
};
webhook.issue = {
  number: 43,
  title: 'add rules documentation',
};

describe('Webhook', () => {
  describe('getAllCommits', () => {
    it('should return an array of 3 commits', () => {
      const commits: WebhookCommit[] = webhook.getAllCommits();

      expect(commits).toEqual(webhook.commits);
    });
  });

  describe('getPullRequestNumber', () => {
    it('should return 22', () => {
      expect(webhook.getPullRequestNumber()).toBe(22);
    });
  });

  describe('getPullRequestDescription', () => {
    it('should return "my desc"', () => {
      expect(webhook.getPullRequestDescription()).toBe('my desc');
    });
  });

  describe('getPullRequestTitle', () => {
    it('should return "my PR for webhook"', () => {
      expect(webhook.getPullRequestTitle()).toBe('my PR for webhook');
    });
  });

  describe('getBranchName', () => {
    it('should return "features/fix"', () => {
      expect(webhook.getBranchName()).toBe('features/fix');
    });
  });

  describe('getIssueTitle', () => {
    it('should return "add rules documentation"', () => {
      expect(webhook.getIssueTitle()).toBe('add rules documentation');
    });
  });

  describe('getIssueNumber', () => {
    it('should return 43', () => {
      expect(webhook.getIssueNumber()).toBe(43);
    });
  });

  describe('getGitType', () => {
    it('should return GitTypeEnum.Github', () => {
      expect(webhook.getGitType()).toBe(GitTypeEnum.Github);
    });
  });

  describe('getGitEvent', () => {
    it('should return GitEventEnum.NewBranch', () => {
      expect(webhook.getGitEvent()).toBe(GitEventEnum.NewBranch);
    });
  });

  describe('getCloneURL', () => {
    it('should return https://github.com/bastienterrier/test-webhook.git', () => {
      expect(webhook.getCloneURL()).toBe(
        'https://github.com/bastienterrier/test-webhook.git',
      );
    });
  });
});