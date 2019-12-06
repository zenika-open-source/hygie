import { Webhook, WebhookCommit } from '../../src/webhook/webhook';
import { GitlabService } from '../../src/gitlab/gitlab.service';
import { GithubService } from '../../src/github/github.service';
import { HttpService } from '@nestjs/common';
import { GitEventEnum, GitTypeEnum, CommitStatusEnum } from '../../src/webhook/utils.enum';
import { CronInterface } from '../../src/scheduler/cron.interface';

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
  defaultBranchName: 'master',
};
webhook.pullRequest = {
  title: 'my PR for webhook',
  description: 'my desc',
  number: 22,
};
webhook.issue = {
  number: 43,
  title: 'add rules documentation',
  description: 'please consider adding a Rules section',
};
webhook.comment = {
  id: 22,
  description: 'my comment',
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

  describe('getDefaultBranchName', () => {
    it('should return "master"', () => {
      expect(webhook.getDefaultBranchName()).toBe('master');
    });
  });

  describe('getIssueTitle', () => {
    it('should return "add rules documentation"', () => {
      expect(webhook.getIssueTitle()).toBe('add rules documentation');
    });
  });

  describe('getIssueDescription', () => {
    it('should return "please consider adding a Rules section"', () => {
      expect(webhook.getIssueDescription()).toBe(
        'please consider adding a Rules section',
      );
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

  describe('getCommentId', () => {
    it('should return 22', () => {
      expect(webhook.getCommentId()).toBe(22);
    });
  });

  describe('getCommentDescription', () => {
    it('should return "my comment"', () => {
      expect(webhook.getCommentDescription()).toBe('my comment');
    });
  });

  describe('getRemoteEnvs', () => {
    it('should return "bastienterrier/test-webhook"', () => {
      expect(webhook.getRemoteDirectory()).toBe('bastienterrier/test-webhook');
    });
  });

  describe('getGitCommitStatusInfos', () => {
    it('should return an object', () => {
      expect(
        webhook.getGitCommitStatusInfos(CommitStatusEnum.Success, '22'),
      ).toEqual({
        commitSha: '22',
        commitStatus: 'Success',
      });
    });
  });

  describe('getGitApiInfos', () => {
    it('should return an object with Github', () => {
      expect(webhook.getGitApiInfos()).toEqual({
        git: 'Github',
        repositoryFullName: 'bastienterrier/test_webhook',
      });
    });
  });

  describe('getGitApiInfos', () => {
    it('should return an object with Gitlab', () => {
      webhook.gitType = GitTypeEnum.Gitlab;
      expect(webhook.getGitApiInfos()).toEqual({
        git: 'Gitlab',
        projectId: '1',
      });
    });
  });

  describe('setCronWebhook', () => {
    it('should create the Cron Webhook with Gitlab', () => {
      const myWebhook: Webhook = new Webhook(gitlabService, githubService);
      const cron: CronInterface = {
        expression: '*/30 * * * * *',
        filename: 'cron-1.rulesrc',
        projectURL: 'https://gitlab.com/bastien.terrier/test_webhook',
        gitlabProjectId: 10607595,
      };
      myWebhook.setCronWebhook(cron);
      expect(myWebhook.gitType).toBe(GitTypeEnum.Gitlab);
      expect(myWebhook.gitEvent).toBe(GitEventEnum.Cron);
      expect(myWebhook.repository.cloneURL).toBe(
        'https://gitlab.com/bastien.terrier/test_webhook',
      );
      expect(myWebhook.repository.fullName).toBe(undefined);
      expect(myWebhook.projectId).toBe(10607595);
    });
    it('should create the Cron Webhook with Github', () => {
      const myWebhook: Webhook = new Webhook(gitlabService, githubService);
      const cron: CronInterface = {
        expression: '*/30 * * * * *',
        filename: 'cron-1.rulesrc',
        projectURL: 'https://github.com/zenika-open-source/hygie',
      };
      myWebhook.setCronWebhook(cron);
      expect(myWebhook.gitType).toBe(GitTypeEnum.Github);
      expect(myWebhook.gitEvent).toBe(GitEventEnum.Cron);
      expect(myWebhook.repository.cloneURL).toBe(
        'https://github.com/zenika-open-source/hygie',
      );
      expect(myWebhook.repository.fullName).toBe('zenika-open-source/hygie');
      expect(myWebhook.projectId).toBe(undefined);
    });
  });
});
