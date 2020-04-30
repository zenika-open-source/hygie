import * as utils from './utils.enum';
import { CommitStatusEnum, GitTypeEnum, GitEventEnum } from './utils.enum';
import { IssuePRStateEnum } from '../git/gitIssueInfos';
import { GitlabService } from '../gitlab/gitlab.service';
import { GithubService } from '../github/github.service';
import { Webhook } from './webhook';
import { TestingModule, Test } from '@nestjs/testing';
import { MockGitlabService, MockGithubService } from '../__mocks__/mocks';

describe('Utils Enum', () => {
  let app: TestingModule;
  let githubService: GithubService;
  let gitlabService: GitlabService;
  let webhook: Webhook;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        { provide: GitlabService, useClass: MockGitlabService },
        { provide: GithubService, useClass: MockGithubService },
      ],
    }).compile();

    githubService = app.get(GithubService);
    gitlabService = app.get(GitlabService);
    webhook = new Webhook(gitlabService, githubService);
  });

  describe('convertCommitStatus', () => {
    it('should equal "failure"', () => {
      const res: string = utils.convertCommitStatus(
        utils.GitTypeEnum.Github,
        CommitStatusEnum.Failure,
      );
      expect(res).toBe('failure');
    });

    it('should equal "failed"', () => {
      const res: string = utils.convertCommitStatus(
        utils.GitTypeEnum.Gitlab,
        CommitStatusEnum.Failure,
      );
      expect(res).toBe('failed');
    });

    it('should equal "success"', () => {
      const res: string = utils.convertCommitStatus(
        utils.GitTypeEnum.Gitlab,
        CommitStatusEnum.Success,
      );
      expect(res).toBe('success');
    });

    it('should equal "success"', () => {
      const res: string = utils.convertCommitStatus(
        utils.GitTypeEnum.Gitlab,
        CommitStatusEnum.Success,
      );
      expect(res).toBe('success');
    });
    it('should equal "pending"', () => {
      const res: string = utils.convertCommitStatus(
        utils.GitTypeEnum.Gitlab,
        CommitStatusEnum.Pending,
      );
      expect(res).toBe('pending');
    });

    it('should equal "pending"', () => {
      const res: string = utils.convertCommitStatus(
        utils.GitTypeEnum.Gitlab,
        CommitStatusEnum.Pending,
      );
      expect(res).toBe('pending');
    });
  });

  describe('convertIssueState', () => {
    it('should equal "open"', () => {
      const res: string = utils.convertIssueState(
        utils.GitTypeEnum.Github,
        IssuePRStateEnum.Open,
      );
      expect(res).toBe('open');
    });

    it('should equal "closed"', () => {
      const res: string = utils.convertIssueState(
        utils.GitTypeEnum.Github,
        IssuePRStateEnum.Close,
      );
      expect(res).toBe('closed');
    });

    it('should equal "reopen"', () => {
      const res: string = utils.convertIssueState(
        utils.GitTypeEnum.Gitlab,
        IssuePRStateEnum.Open,
      );
      expect(res).toBe('reopen');
    });

    it('should equal "close"', () => {
      const res: string = utils.convertIssueState(
        utils.GitTypeEnum.Gitlab,
        IssuePRStateEnum.Close,
      );
      expect(res).toBe('close');
    });
  });

  describe('isPushEvent', () => {
    const gitlabPushEvent = {
      object_kind: 'push',
      event_name: 'push',
      before: '518f9aad2cac09a78157198fcc3f88cf0cc79be3',
      after: 'a3b2abdc7815a4cfa8998e2b91aa74ff1736ce97',
      ref: 'refs/heads/master',
      checkout_sha: 'a3b2abdc7815a4cfa8998e2b91aa74ff1736ce97',
      message: null,
      user_id: 3360534,
      user_name: 'Bastien Terrier',
      user_username: 'bastien.terrier',
      user_email: '',
      user_avatar:
        'https://secure.gravatar.com/avatar/a17bda7df8612108bc4442ce57cc6dc3?s=80&d=identicon',
      project_id: 10607595,
      project: {
        id: 10607595,
        name: 'test_webhook',
        description: '',
        web_url: 'https://gitlab.com/bastien.terrier/test_webhook',
        avatar_url: null,
        git_ssh_url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
        git_http_url: 'https://gitlab.com/bastien.terrier/test_webhook.git',
        namespace: 'bastien.terrier',
        visibility_level: 0,
        path_with_namespace: 'bastien.terrier/test_webhook',
        default_branch: 'master',
        ci_config_path: null,
        homepage: 'https://gitlab.com/bastien.terrier/test_webhook',
        url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
        ssh_url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
        http_url: 'https://gitlab.com/bastien.terrier/test_webhook.git',
      },
      commits: [
        {
          id: 'a3b2abdc7815a4cfa8998e2b91aa74ff1736ce97',
          message: 'Update README.md',
          timestamp: '2019-03-14T08:27:14Z',
          url:
            'https://gitlab.com/bastien.terrier/test_webhook/commit/a3b2abdc7815a4cfa8998e2b91aa74ff1736ce97',
          author: {
            name: 'Bastien Terrier',
            email: 'bastien.terrier@gmail.com',
          },
          added: [],
          modified: ['README.md'],
          removed: [],
        },
      ],
      total_commits_count: 1,
      push_options: [],
      repository: {
        name: 'test_webhook',
        url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
        description: '',
        homepage: 'https://gitlab.com/bastien.terrier/test_webhook',
        git_http_url: 'https://gitlab.com/bastien.terrier/test_webhook.git',
        git_ssh_url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
        visibility_level: 0,
      },
    };
    const githubPushEvent = {
      ref: 'refs/heads/test4',
      before: 'a302f5fcc3f67ff85b1bfd31a703df04b9090ff4',
      after: 'f1e7b7b0eff0ac9b582a248e42534bffea0e3885',
      created: false,
      deleted: false,
      forced: false,
      base_ref: null,
      compare:
        'https://github.com/bastienterrier/test-webhook/compare/a302f5fcc3f6...f1e7b7b0eff0',
      commits: [
        {
          id: 'f1e7b7b0eff0ac9b582a248e42534bffea0e3885',
          tree_id: 'a753c249b5f65116cd17f98aee9bea5ac2661844',
          distinct: true,
          message: 'Update README.md',
          timestamp: '2019-03-14T09:37:07+01:00',
          url:
            'https://github.com/bastienterrier/test-webhook/commit/f1e7b7b0eff0ac9b582a248e42534bffea0e3885',
          author: {
            name: 'Bastien TERRIER',
            email: 'bastien.terrier@gmail.com',
            username: 'bastienterrier',
          },
          committer: {
            name: 'GitHub',
            email: 'noreply@github.com',
            username: 'web-flow',
          },
          added: [],
          removed: [],
          modified: ['README.md'],
        },
      ],
      head_commit: {
        id: 'f1e7b7b0eff0ac9b582a248e42534bffea0e3885',
        tree_id: 'a753c249b5f65116cd17f98aee9bea5ac2661844',
        distinct: true,
        message: 'Update README.md',
        timestamp: '2019-03-14T09:37:07+01:00',
        url:
          'https://github.com/bastienterrier/test-webhook/commit/f1e7b7b0eff0ac9b582a248e42534bffea0e3885',
        author: {
          name: 'Bastien TERRIER',
          email: 'bastien.terrier@gmail.com',
          username: 'bastienterrier',
        },
        committer: {
          name: 'GitHub',
          email: 'noreply@github.com',
          username: 'web-flow',
        },
        added: [],
        removed: [],
        modified: ['README.md'],
      },
      repository: {
        id: 169373600,
        node_id: 'MDEwOlJlcG9zaXRvcnkxNjkzNzM2MDA=',
        name: 'test-webhook',
        full_name: 'bastienterrier/test-webhook',
        private: false,
        owner: {
          name: 'bastienterrier',
          email: 'bastien.terrier@gmail.com',
          login: 'bastienterrier',
          id: 25296454,
          node_id: 'MDQ6VXNlcjI1Mjk2NDU0',
          avatar_url: 'https://avatars0.githubusercontent.com/u/25296454?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/bastienterrier',
          html_url: 'https://github.com/bastienterrier',
          followers_url:
            'https://api.github.com/users/bastienterrier/followers',
          following_url:
            'https://api.github.com/users/bastienterrier/following{/other_user}',
          gists_url:
            'https://api.github.com/users/bastienterrier/gists{/gist_id}',
          starred_url:
            'https://api.github.com/users/bastienterrier/starred{/owner}{/repo}',
          subscriptions_url:
            'https://api.github.com/users/bastienterrier/subscriptions',
          organizations_url: 'https://api.github.com/users/bastienterrier/orgs',
          repos_url: 'https://api.github.com/users/bastienterrier/repos',
          events_url:
            'https://api.github.com/users/bastienterrier/events{/privacy}',
          received_events_url:
            'https://api.github.com/users/bastienterrier/received_events',
          type: 'User',
          site_admin: false,
        },
        html_url: 'https://github.com/bastienterrier/test-webhook',
        description: null,
        fork: false,
        url: 'https://github.com/bastienterrier/test-webhook',
        forks_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/forks',
        keys_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/keys{/key_id}',
        collaborators_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/collaborators{/collaborator}',
        teams_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/teams',
        hooks_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/hooks',
        issue_events_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/issues/events{/number}',
        events_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/events',
        assignees_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/assignees{/user}',
        branches_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/branches{/branch}',
        tags_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/tags',
        blobs_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/git/blobs{/sha}',
        git_tags_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/git/tags{/sha}',
        git_refs_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/git/refs{/sha}',
        trees_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/git/trees{/sha}',
        statuses_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/statuses/{sha}',
        languages_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/languages',
        stargazers_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/stargazers',
        contributors_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/contributors',
        subscribers_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/subscribers',
        subscription_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/subscription',
        commits_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/commits{/sha}',
        git_commits_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/git/commits{/sha}',
        comments_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/comments{/number}',
        issue_comment_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/issues/comments{/number}',
        contents_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/contents/{+path}',
        compare_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/compare/{base}...{head}',
        merges_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/merges',
        archive_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/{archive_format}{/ref}',
        downloads_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/downloads',
        issues_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/issues{/number}',
        pulls_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/pulls{/number}',
        milestones_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/milestones{/number}',
        notifications_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/notifications{?since,all,participating}',
        labels_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/labels{/name}',
        releases_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/releases{/id}',
        deployments_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/deployments',
        created_at: 1549440848,
        updated_at: '2019-02-25T13:02:50Z',
        pushed_at: 1552552627,
        git_url: 'git://github.com/bastienterrier/test-webhook.git',
        ssh_url: 'git@github.com:bastienterrier/test-webhook.git',
        clone_url: 'https://github.com/bastienterrier/test-webhook.git',
        svn_url: 'https://github.com/bastienterrier/test-webhook',
        homepage: null,
        size: 25427,
        stargazers_count: 0,
        watchers_count: 0,
        language: 'Shell',
        has_issues: true,
        has_projects: true,
        has_downloads: true,
        has_wiki: true,
        has_pages: true,
        forks_count: 0,
        mirror_url: null,
        archived: false,
        open_issues_count: 8,
        license: null,
        forks: 0,
        open_issues: 8,
        watchers: 0,
        default_branch: 'master',
        stargazers: 0,
        master_branch: 'master',
      },
      pusher: {
        name: 'bastienterrier',
        email: 'bastien.terrier@gmail.com',
      },
      sender: {
        login: 'bastienterrier',
        id: 25296454,
        node_id: 'MDQ6VXNlcjI1Mjk2NDU0',
        avatar_url: 'https://avatars0.githubusercontent.com/u/25296454?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/bastienterrier',
        html_url: 'https://github.com/bastienterrier',
        followers_url: 'https://api.github.com/users/bastienterrier/followers',
        following_url:
          'https://api.github.com/users/bastienterrier/following{/other_user}',
        gists_url:
          'https://api.github.com/users/bastienterrier/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/bastienterrier/starred{/owner}{/repo}',
        subscriptions_url:
          'https://api.github.com/users/bastienterrier/subscriptions',
        organizations_url: 'https://api.github.com/users/bastienterrier/orgs',
        repos_url: 'https://api.github.com/users/bastienterrier/repos',
        events_url:
          'https://api.github.com/users/bastienterrier/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/bastienterrier/received_events',
        type: 'User',
        site_admin: false,
      },
    };
    it('isGitlabPushEvent should equal "true"', () => {
      expect(utils.isGitlabPushEvent(gitlabPushEvent)).toBe(true);
    });

    it('isGitlabPushEvent should equal "false"', () => {
      expect(utils.isGitlabPushEvent(githubPushEvent)).toBe(false);
    });

    it('isGithubPushEvent should equal "true"', () => {
      expect(utils.isGithubPushEvent(githubPushEvent)).toBe(true);
    });

    it('isGithubPushEvent should equal "false"', () => {
      expect(utils.isGithubPushEvent(gitlabPushEvent)).toBe(false);
    });

    it('should create a Webhook object according to the Gitlab Push Hook', () => {
      webhook = new Webhook(gitlabService, githubService);
      webhook.gitToWebhook(gitlabPushEvent);

      expect(webhook.gitType).toBe(GitTypeEnum.Gitlab);
      expect(webhook.gitEvent).toBe(GitEventEnum.Push);
      expect(webhook.projectId).toBe(10607595);
      expect(webhook.gitService).toBe(gitlabService);
      expect(webhook.commits).toEqual([
        {
          added: [],
          message: 'Update README.md',
          modified: ['README.md'],
          removed: [],
          sha: 'a3b2abdc7815a4cfa8998e2b91aa74ff1736ce97',
        },
      ]);
      expect(webhook.branchName).toBe('master');
      expect(webhook.repository.cloneURL).toBe(
        'https://gitlab.com/bastien.terrier/test_webhook',
      );
      expect(webhook.user.login).toBe('bastien.terrier');
    });

    it('should create a Webhook object according to the Github Push Hook', () => {
      webhook = new Webhook(gitlabService, githubService);
      webhook.gitToWebhook(githubPushEvent);

      expect(webhook.gitType).toBe(GitTypeEnum.Github);
      expect(webhook.gitEvent).toBe(GitEventEnum.Push);
      expect(webhook.repository.fullName).toBe('bastienterrier/test-webhook');
      expect(webhook.gitService).toBe(githubService);
      expect(webhook.commits).toEqual([
        {
          sha: 'f1e7b7b0eff0ac9b582a248e42534bffea0e3885',
          message: 'Update README.md',
          added: [],
          modified: ['README.md'],
          removed: [],
        },
      ]);
      expect(webhook.branchName).toBe('test4');
      expect(webhook.repository.cloneURL).toBe(
        'https://github.com/bastienterrier/test-webhook',
      );
      expect(webhook.user.login).toBe('bastienterrier');
    });
  });

  describe('isNewBranchEvent', () => {
    const gitlabNewBranchEvent = {
      object_kind: 'push',
      event_name: 'push',
      before: '0000000000000000000000000000000000000000',
      after: 'a3b2abdc7815a4cfa8998e2b91aa74ff1736ce97',
      ref: 'refs/heads/feature/tdd',
      checkout_sha: 'a3b2abdc7815a4cfa8998e2b91aa74ff1736ce97',
      message: null,
      user_id: 3360534,
      user_name: 'Bastien Terrier',
      user_username: 'bastien.terrier',
      user_email: '',
      user_avatar:
        'https://secure.gravatar.com/avatar/a17bda7df8612108bc4442ce57cc6dc3?s=80&d=identicon',
      project_id: 10607595,
      project: {
        id: 10607595,
        name: 'test_webhook',
        description: '',
        web_url: 'https://gitlab.com/bastien.terrier/test_webhook',
        avatar_url: null,
        git_ssh_url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
        git_http_url: 'https://gitlab.com/bastien.terrier/test_webhook.git',
        namespace: 'bastien.terrier',
        visibility_level: 0,
        path_with_namespace: 'bastien.terrier/test_webhook',
        default_branch: 'master',
        ci_config_path: null,
        homepage: 'https://gitlab.com/bastien.terrier/test_webhook',
        url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
        ssh_url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
        http_url: 'https://gitlab.com/bastien.terrier/test_webhook.git',
      },
      commits: [],
      total_commits_count: 0,
      push_options: [],
      repository: {
        name: 'test_webhook',
        url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
        description: '',
        homepage: 'https://gitlab.com/bastien.terrier/test_webhook',
        git_http_url: 'https://gitlab.com/bastien.terrier/test_webhook.git',
        git_ssh_url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
        visibility_level: 0,
      },
    };
    const githubNewBranchEvent = {
      ref: 'feat/tdd',
      ref_type: 'branch',
      master_branch: 'master',
      description: null,
      pusher_type: 'user',
      repository: {
        id: 169373600,
        node_id: 'MDEwOlJlcG9zaXRvcnkxNjkzNzM2MDA=',
        name: 'test-webhook',
        full_name: 'bastienterrier/test-webhook',
        private: false,
        owner: {
          login: 'bastienterrier',
          id: 25296454,
          node_id: 'MDQ6VXNlcjI1Mjk2NDU0',
          avatar_url: 'https://avatars0.githubusercontent.com/u/25296454?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/bastienterrier',
          html_url: 'https://github.com/bastienterrier',
          followers_url:
            'https://api.github.com/users/bastienterrier/followers',
          following_url:
            'https://api.github.com/users/bastienterrier/following{/other_user}',
          gists_url:
            'https://api.github.com/users/bastienterrier/gists{/gist_id}',
          starred_url:
            'https://api.github.com/users/bastienterrier/starred{/owner}{/repo}',
          subscriptions_url:
            'https://api.github.com/users/bastienterrier/subscriptions',
          organizations_url: 'https://api.github.com/users/bastienterrier/orgs',
          repos_url: 'https://api.github.com/users/bastienterrier/repos',
          events_url:
            'https://api.github.com/users/bastienterrier/events{/privacy}',
          received_events_url:
            'https://api.github.com/users/bastienterrier/received_events',
          type: 'User',
          site_admin: false,
        },
        html_url: 'https://github.com/bastienterrier/test-webhook',
        description: null,
        fork: false,
        url: 'https://api.github.com/repos/bastienterrier/test-webhook',
        forks_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/forks',
        keys_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/keys{/key_id}',
        collaborators_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/collaborators{/collaborator}',
        teams_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/teams',
        hooks_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/hooks',
        issue_events_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/issues/events{/number}',
        events_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/events',
        assignees_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/assignees{/user}',
        branches_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/branches{/branch}',
        tags_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/tags',
        blobs_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/git/blobs{/sha}',
        git_tags_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/git/tags{/sha}',
        git_refs_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/git/refs{/sha}',
        trees_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/git/trees{/sha}',
        statuses_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/statuses/{sha}',
        languages_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/languages',
        stargazers_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/stargazers',
        contributors_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/contributors',
        subscribers_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/subscribers',
        subscription_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/subscription',
        commits_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/commits{/sha}',
        git_commits_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/git/commits{/sha}',
        comments_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/comments{/number}',
        issue_comment_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/issues/comments{/number}',
        contents_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/contents/{+path}',
        compare_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/compare/{base}...{head}',
        merges_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/merges',
        archive_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/{archive_format}{/ref}',
        downloads_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/downloads',
        issues_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/issues{/number}',
        pulls_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/pulls{/number}',
        milestones_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/milestones{/number}',
        notifications_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/notifications{?since,all,participating}',
        labels_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/labels{/name}',
        releases_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/releases{/id}',
        deployments_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/deployments',
        created_at: '2019-02-06T08:14:08Z',
        updated_at: '2019-02-25T13:02:50Z',
        pushed_at: '2019-03-14T08:40:08Z',
        git_url: 'git://github.com/bastienterrier/test-webhook.git',
        ssh_url: 'git@github.com:bastienterrier/test-webhook.git',
        clone_url: 'https://github.com/bastienterrier/test-webhook.git',
        svn_url: 'https://github.com/bastienterrier/test-webhook',
        homepage: null,
        size: 25427,
        stargazers_count: 0,
        watchers_count: 0,
        language: 'Shell',
        has_issues: true,
        has_projects: true,
        has_downloads: true,
        has_wiki: true,
        has_pages: true,
        forks_count: 0,
        mirror_url: null,
        archived: false,
        open_issues_count: 8,
        license: null,
        forks: 0,
        open_issues: 8,
        watchers: 0,
        default_branch: 'master',
      },
      sender: {
        login: 'bastienterrier',
        id: 25296454,
        node_id: 'MDQ6VXNlcjI1Mjk2NDU0',
        avatar_url: 'https://avatars0.githubusercontent.com/u/25296454?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/bastienterrier',
        html_url: 'https://github.com/bastienterrier',
        followers_url: 'https://api.github.com/users/bastienterrier/followers',
        following_url:
          'https://api.github.com/users/bastienterrier/following{/other_user}',
        gists_url:
          'https://api.github.com/users/bastienterrier/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/bastienterrier/starred{/owner}{/repo}',
        subscriptions_url:
          'https://api.github.com/users/bastienterrier/subscriptions',
        organizations_url: 'https://api.github.com/users/bastienterrier/orgs',
        repos_url: 'https://api.github.com/users/bastienterrier/repos',
        events_url:
          'https://api.github.com/users/bastienterrier/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/bastienterrier/received_events',
        type: 'User',
        site_admin: false,
      },
    };

    it('isGitlabBranchEvent should equal "true"', () => {
      expect(utils.isGitlabNewBranchEvent(gitlabNewBranchEvent)).toBe(true);
    });

    it('isGitlabBranchEvent should equal "false"', () => {
      expect(utils.isGitlabNewBranchEvent(githubNewBranchEvent)).toBe(false);
    });

    it('isGithubNewBranchEvent should equal "true"', () => {
      expect(utils.isGithubNewBranchEvent(githubNewBranchEvent)).toBe(true);
    });

    it('isGithubNewBranchEvent should equal "false"', () => {
      expect(utils.isGithubNewBranchEvent(gitlabNewBranchEvent)).toBe(false);
    });

    it('should create a Webhook object according to the Gitlab Branch Hook', () => {
      webhook = new Webhook(gitlabService, githubService);
      webhook.gitToWebhook(gitlabNewBranchEvent);

      expect(webhook.gitType).toBe(GitTypeEnum.Gitlab);
      expect(webhook.gitEvent).toBe(GitEventEnum.NewBranch);
      expect(webhook.projectId).toBe(10607595);
      expect(webhook.gitService).toBe(gitlabService);
      expect(webhook.branchName).toBe('feature/tdd');
      expect(webhook.repository.cloneURL).toBe(
        'https://gitlab.com/bastien.terrier/test_webhook',
      );
      expect(webhook.user.login).toBe('bastien.terrier');
    });

    it('should create a Webhook object according to the Github Branch Hook', () => {
      webhook = new Webhook(gitlabService, githubService);
      webhook.gitToWebhook(githubNewBranchEvent);

      expect(webhook.gitType).toBe(GitTypeEnum.Github);
      expect(webhook.gitEvent).toBe(GitEventEnum.NewBranch);
      expect(webhook.gitService).toBe(githubService);
      expect(webhook.branchName).toBe('feat/tdd');
      expect(webhook.repository.fullName).toBe('bastienterrier/test-webhook');
      expect(webhook.repository.cloneURL).toBe(
        'https://github.com/bastienterrier/test-webhook',
      );
      expect(webhook.user.login).toBe('bastienterrier');
    });
  });

  describe('isDeletedBranchEvent', () => {
    const githubDeletedBranchEvent = {
      ref: 'feature/titi',
      ref_type: 'branch',
      pusher_type: 'user',
      repository: {
        id: 169373600,
        node_id: 'MDEwOlJlcG9zaXRvcnkxNjkzNzM2MDA=',
        name: 'test-webhook',
        full_name: 'bastienterrier/test-webhook',
        private: false,
        owner: {
          login: 'bastienterrier',
          id: 25296454,
          node_id: 'MDQ6VXNlcjI1Mjk2NDU0',
          avatar_url: 'https://avatars0.githubusercontent.com/u/25296454?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/bastienterrier',
          html_url: 'https://github.com/bastienterrier',
          followers_url:
            'https://api.github.com/users/bastienterrier/followers',
          following_url:
            'https://api.github.com/users/bastienterrier/following{/other_user}',
          gists_url:
            'https://api.github.com/users/bastienterrier/gists{/gist_id}',
          starred_url:
            'https://api.github.com/users/bastienterrier/starred{/owner}{/repo}',
          subscriptions_url:
            'https://api.github.com/users/bastienterrier/subscriptions',
          organizations_url: 'https://api.github.com/users/bastienterrier/orgs',
          repos_url: 'https://api.github.com/users/bastienterrier/repos',
          events_url:
            'https://api.github.com/users/bastienterrier/events{/privacy}',
          received_events_url:
            'https://api.github.com/users/bastienterrier/received_events',
          type: 'User',
          site_admin: false,
        },
        html_url: 'https://github.com/bastienterrier/test-webhook',
        description: null,
        fork: false,
        url: 'https://api.github.com/repos/bastienterrier/test-webhook',
        forks_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/forks',
        keys_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/keys{/key_id}',
        collaborators_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/collaborators{/collaborator}',
        teams_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/teams',
        hooks_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/hooks',
        issue_events_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/issues/events{/number}',
        events_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/events',
        assignees_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/assignees{/user}',
        branches_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/branches{/branch}',
        tags_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/tags',
        blobs_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/git/blobs{/sha}',
        git_tags_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/git/tags{/sha}',
        git_refs_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/git/refs{/sha}',
        trees_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/git/trees{/sha}',
        statuses_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/statuses/{sha}',
        languages_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/languages',
        stargazers_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/stargazers',
        contributors_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/contributors',
        subscribers_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/subscribers',
        subscription_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/subscription',
        commits_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/commits{/sha}',
        git_commits_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/git/commits{/sha}',
        comments_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/comments{/number}',
        issue_comment_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/issues/comments{/number}',
        contents_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/contents/{+path}',
        compare_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/compare/{base}...{head}',
        merges_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/merges',
        archive_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/{archive_format}{/ref}',
        downloads_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/downloads',
        issues_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/issues{/number}',
        pulls_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/pulls{/number}',
        milestones_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/milestones{/number}',
        notifications_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/notifications{?since,all,participating}',
        labels_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/labels{/name}',
        releases_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/releases{/id}',
        deployments_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/deployments',
        created_at: '2019-02-06T08:14:08Z',
        updated_at: '2019-06-18T09:06:29Z',
        pushed_at: '2019-06-18T10:01:13Z',
        git_url: 'git://github.com/bastienterrier/test-webhook.git',
        ssh_url: 'git@github.com:bastienterrier/test-webhook.git',
        clone_url: 'https://github.com/bastienterrier/test-webhook.git',
        svn_url: 'https://github.com/bastienterrier/test-webhook',
        homepage: null,
        size: 25625,
        stargazers_count: 0,
        watchers_count: 0,
        language: 'Shell',
        has_issues: true,
        has_projects: true,
        has_downloads: true,
        has_wiki: true,
        has_pages: true,
        forks_count: 0,
        mirror_url: null,
        archived: false,
        disabled: false,
        open_issues_count: 53,
        license: null,
        forks: 0,
        open_issues: 53,
        watchers: 0,
        default_branch: 'master',
      },
      sender: {
        login: 'bastienterrier',
        id: 25296454,
        node_id: 'MDQ6VXNlcjI1Mjk2NDU0',
        avatar_url: 'https://avatars0.githubusercontent.com/u/25296454?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/bastienterrier',
        html_url: 'https://github.com/bastienterrier',
        followers_url: 'https://api.github.com/users/bastienterrier/followers',
        following_url:
          'https://api.github.com/users/bastienterrier/following{/other_user}',
        gists_url:
          'https://api.github.com/users/bastienterrier/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/bastienterrier/starred{/owner}{/repo}',
        subscriptions_url:
          'https://api.github.com/users/bastienterrier/subscriptions',
        organizations_url: 'https://api.github.com/users/bastienterrier/orgs',
        repos_url: 'https://api.github.com/users/bastienterrier/repos',
        events_url:
          'https://api.github.com/users/bastienterrier/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/bastienterrier/received_events',
        type: 'User',
        site_admin: false,
      },
    };
    const gitlabDeletedBranchEvent = {
      object_kind: 'push',
      event_name: 'push',
      before: '14f8a81413fc6021fef076c86297c0bc9e4e1041',
      after: '0000000000000000000000000000000000000000',
      ref: 'refs/heads/some/feature',
      checkout_sha: null,
      message: null,
      user_id: 3360534,
      user_name: 'Bastien Terrier',
      user_username: 'bastien.terrier',
      user_email: '',
      user_avatar:
        'https://secure.gravatar.com/avatar/a17bda7df8612108bc4442ce57cc6dc3?s=80&d=identicon',
      project_id: 10607595,
      project: {
        id: 10607595,
        name: 'test_webhook',
        description: '',
        web_url: 'https://gitlab.com/bastien.terrier/test_webhook',
        avatar_url: null,
        git_ssh_url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
        git_http_url: 'https://gitlab.com/bastien.terrier/test_webhook.git',
        namespace: 'bastien.terrier',
        visibility_level: 20,
        path_with_namespace: 'bastien.terrier/test_webhook',
        default_branch: 'master',
        ci_config_path: null,
        homepage: 'https://gitlab.com/bastien.terrier/test_webhook',
        url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
        ssh_url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
        http_url: 'https://gitlab.com/bastien.terrier/test_webhook.git',
      },
      commits: [],
      total_commits_count: 0,
      push_options: {},
      repository: {
        name: 'test_webhook',
        url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
        description: '',
        homepage: 'https://gitlab.com/bastien.terrier/test_webhook',
        git_http_url: 'https://gitlab.com/bastien.terrier/test_webhook.git',
        git_ssh_url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
        visibility_level: 20,
      },
    };
    it('isDeletedBranchEvent should equal "true"', () => {
      expect(utils.isGithubDeletedBranchEvent(githubDeletedBranchEvent)).toBe(
        true,
      );
    });
    it('isDeletedBranchEvent should equal "false"', () => {
      expect(utils.isGithubDeletedBranchEvent(gitlabDeletedBranchEvent)).toBe(
        false,
      );
    });
    it('isGitlabDeletedBranchEvent should equal "true"', () => {
      expect(utils.isGitlabDeletedBranchEvent(gitlabDeletedBranchEvent)).toBe(
        true,
      );
    });
    it('isGitlabDeletedBranchEvent should equal "false"', () => {
      expect(utils.isGitlabDeletedBranchEvent(githubDeletedBranchEvent)).toBe(
        false,
      );
    });
  });
  describe('isIssueEvent', () => {
    const githubIssueEvent = {
      action: 'opened',
      issue: {
        url:
          'https://api.github.com/repos/bastienterrier/test-webhook/issues/89',
        repository_url:
          'https://api.github.com/repos/bastienterrier/test-webhook',
        labels_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/issues/89/labels{/name}',
        comments_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/issues/89/comments',
        events_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/issues/89/events',
        html_url: 'https://github.com/bastienterrier/test-webhook/issues/89',
        id: 420902360,
        node_id: 'MDU6SXNzdWU0MjA5MDIzNjA=',
        number: 89,
        title: 'new issue',
        user: {
          login: 'bastienterrier',
          id: 25296454,
          node_id: 'MDQ6VXNlcjI1Mjk2NDU0',
          avatar_url: 'https://avatars0.githubusercontent.com/u/25296454?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/bastienterrier',
          html_url: 'https://github.com/bastienterrier',
          followers_url:
            'https://api.github.com/users/bastienterrier/followers',
          following_url:
            'https://api.github.com/users/bastienterrier/following{/other_user}',
          gists_url:
            'https://api.github.com/users/bastienterrier/gists{/gist_id}',
          starred_url:
            'https://api.github.com/users/bastienterrier/starred{/owner}{/repo}',
          subscriptions_url:
            'https://api.github.com/users/bastienterrier/subscriptions',
          organizations_url: 'https://api.github.com/users/bastienterrier/orgs',
          repos_url: 'https://api.github.com/users/bastienterrier/repos',
          events_url:
            'https://api.github.com/users/bastienterrier/events{/privacy}',
          received_events_url:
            'https://api.github.com/users/bastienterrier/received_events',
          type: 'User',
          site_admin: false,
        },
        labels: [],
        state: 'open',
        locked: false,
        assignee: null,
        assignees: [],
        milestone: null,
        comments: 0,
        created_at: '2019-03-14T09:07:46Z',
        updated_at: '2019-03-14T09:07:46Z',
        closed_at: null,
        author_association: 'OWNER',
        body: '',
      },
      repository: {
        id: 169373600,
        node_id: 'MDEwOlJlcG9zaXRvcnkxNjkzNzM2MDA=',
        name: 'test-webhook',
        full_name: 'bastienterrier/test-webhook',
        private: false,
        owner: {
          login: 'bastienterrier',
          id: 25296454,
          node_id: 'MDQ6VXNlcjI1Mjk2NDU0',
          avatar_url: 'https://avatars0.githubusercontent.com/u/25296454?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/bastienterrier',
          html_url: 'https://github.com/bastienterrier',
          followers_url:
            'https://api.github.com/users/bastienterrier/followers',
          following_url:
            'https://api.github.com/users/bastienterrier/following{/other_user}',
          gists_url:
            'https://api.github.com/users/bastienterrier/gists{/gist_id}',
          starred_url:
            'https://api.github.com/users/bastienterrier/starred{/owner}{/repo}',
          subscriptions_url:
            'https://api.github.com/users/bastienterrier/subscriptions',
          organizations_url: 'https://api.github.com/users/bastienterrier/orgs',
          repos_url: 'https://api.github.com/users/bastienterrier/repos',
          events_url:
            'https://api.github.com/users/bastienterrier/events{/privacy}',
          received_events_url:
            'https://api.github.com/users/bastienterrier/received_events',
          type: 'User',
          site_admin: false,
        },
        html_url: 'https://github.com/bastienterrier/test-webhook',
        description: null,
        fork: false,
        url: 'https://api.github.com/repos/bastienterrier/test-webhook',
        forks_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/forks',
        keys_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/keys{/key_id}',
        collaborators_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/collaborators{/collaborator}',
        teams_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/teams',
        hooks_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/hooks',
        issue_events_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/issues/events{/number}',
        events_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/events',
        assignees_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/assignees{/user}',
        branches_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/branches{/branch}',
        tags_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/tags',
        blobs_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/git/blobs{/sha}',
        git_tags_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/git/tags{/sha}',
        git_refs_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/git/refs{/sha}',
        trees_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/git/trees{/sha}',
        statuses_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/statuses/{sha}',
        languages_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/languages',
        stargazers_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/stargazers',
        contributors_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/contributors',
        subscribers_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/subscribers',
        subscription_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/subscription',
        commits_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/commits{/sha}',
        git_commits_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/git/commits{/sha}',
        comments_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/comments{/number}',
        issue_comment_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/issues/comments{/number}',
        contents_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/contents/{+path}',
        compare_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/compare/{base}...{head}',
        merges_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/merges',
        archive_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/{archive_format}{/ref}',
        downloads_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/downloads',
        issues_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/issues{/number}',
        pulls_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/pulls{/number}',
        milestones_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/milestones{/number}',
        notifications_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/notifications{?since,all,participating}',
        labels_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/labels{/name}',
        releases_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/releases{/id}',
        deployments_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/deployments',
        created_at: '2019-02-06T08:14:08Z',
        updated_at: '2019-02-25T13:02:50Z',
        pushed_at: '2019-03-14T08:53:55Z',
        git_url: 'git://github.com/bastienterrier/test-webhook.git',
        ssh_url: 'git@github.com:bastienterrier/test-webhook.git',
        clone_url: 'https://github.com/bastienterrier/test-webhook.git',
        svn_url: 'https://github.com/bastienterrier/test-webhook',
        homepage: null,
        size: 25427,
        stargazers_count: 0,
        watchers_count: 0,
        language: 'Shell',
        has_issues: true,
        has_projects: true,
        has_downloads: true,
        has_wiki: true,
        has_pages: true,
        forks_count: 0,
        mirror_url: null,
        archived: false,
        open_issues_count: 9,
        license: null,
        forks: 0,
        open_issues: 9,
        watchers: 0,
        default_branch: 'master',
      },
      sender: {
        login: 'bastienterrier',
        id: 25296454,
        node_id: 'MDQ6VXNlcjI1Mjk2NDU0',
        avatar_url: 'https://avatars0.githubusercontent.com/u/25296454?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/bastienterrier',
        html_url: 'https://github.com/bastienterrier',
        followers_url: 'https://api.github.com/users/bastienterrier/followers',
        following_url:
          'https://api.github.com/users/bastienterrier/following{/other_user}',
        gists_url:
          'https://api.github.com/users/bastienterrier/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/bastienterrier/starred{/owner}{/repo}',
        subscriptions_url:
          'https://api.github.com/users/bastienterrier/subscriptions',
        organizations_url: 'https://api.github.com/users/bastienterrier/orgs',
        repos_url: 'https://api.github.com/users/bastienterrier/repos',
        events_url:
          'https://api.github.com/users/bastienterrier/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/bastienterrier/received_events',
        type: 'User',
        site_admin: false,
      },
    };
    const gitlabIssueEvent = {
      object_kind: 'issue',
      event_type: 'issue',
      user: {
        name: 'Bastien Terrier',
        username: 'bastien.terrier',
        avatar_url:
          'https://secure.gravatar.com/avatar/a17bda7df8612108bc4442ce57cc6dc3?s=80&d=identicon',
      },
      project: {
        id: 10607595,
        name: 'test_webhook',
        description: '',
        web_url: 'https://gitlab.com/bastien.terrier/test_webhook',
        avatar_url: null,
        git_ssh_url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
        git_http_url: 'https://gitlab.com/bastien.terrier/test_webhook.git',
        namespace: 'bastien.terrier',
        visibility_level: 0,
        path_with_namespace: 'bastien.terrier/test_webhook',
        default_branch: 'master',
        ci_config_path: null,
        homepage: 'https://gitlab.com/bastien.terrier/test_webhook',
        url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
        ssh_url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
        http_url: 'https://gitlab.com/bastien.terrier/test_webhook.git',
      },
      object_attributes: {
        author_id: 3360534,
        closed_at: null,
        confidential: false,
        created_at: '2019-03-14 09:15:08 UTC',
        description: '',
        due_date: null,
        id: 19106086,
        iid: 19,
        last_edited_at: null,
        last_edited_by_id: null,
        milestone_id: null,
        moved_to_id: null,
        project_id: 10607595,
        relative_position: 1073751323,
        state: 'opened',
        time_estimate: 0,
        title: 'new issue',
        updated_at: '2019-03-14 09:15:08 UTC',
        updated_by_id: null,
        weight: null,
        url: 'https://gitlab.com/bastien.terrier/test_webhook/issues/19',
        total_time_spent: 0,
        human_total_time_spent: null,
        human_time_estimate: null,
        assignee_ids: [],
        assignee_id: null,
        action: 'open',
      },
      labels: [],
      changes: {
        author_id: {
          previous: null,
          current: 3360534,
        },
        created_at: {
          previous: null,
          current: '2019-03-14 09:15:08 UTC',
        },
        description: {
          previous: null,
          current: '',
        },
        id: {
          previous: null,
          current: 19106086,
        },
        iid: {
          previous: null,
          current: 19,
        },
        project_id: {
          previous: null,
          current: 10607595,
        },
        relative_position: {
          previous: null,
          current: 1073751323,
        },
        state: {
          previous: null,
          current: 'opened',
        },
        title: {
          previous: null,
          current: 'new issue',
        },
        updated_at: {
          previous: null,
          current: '2019-03-14 09:15:08 UTC',
        },
        total_time_spent: {
          previous: null,
          current: 0,
        },
      },
      repository: {
        name: 'test_webhook',
        url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
        description: '',
        homepage: 'https://gitlab.com/bastien.terrier/test_webhook',
      },
    };

    it('isGitlabIssueEvent should equal "true"', () => {
      expect(utils.isGitlabIssueEvent(gitlabIssueEvent)).toBe(true);
    });
    it('isGitlabIssueEvent should equal "false"', () => {
      expect(utils.isGitlabIssueEvent(githubIssueEvent)).toBe(false);
    });
    it('isGithubIssueEvent should equal "true"', () => {
      expect(utils.isGithubIssueEvent(githubIssueEvent)).toBe(true);
    });
    it('isGithubIssueEvent should equal "false"', () => {
      expect(utils.isGithubIssueEvent(gitlabIssueEvent)).toBe(false);
    });

    it('should create a Webhook object according to the Gitlab Issue Hook', () => {
      webhook = new Webhook(gitlabService, githubService);
      webhook.gitToWebhook(gitlabIssueEvent);

      expect(webhook.gitType).toBe(GitTypeEnum.Gitlab);
      expect(webhook.gitEvent).toBe(GitEventEnum.NewIssue);
      expect(webhook.projectId).toBe(10607595);
      expect(webhook.gitService).toBe(gitlabService);
      expect(webhook.issue.number).toBe(19);
      expect(webhook.issue.title).toBe('new issue');
      expect(webhook.repository.cloneURL).toBe(
        'https://gitlab.com/bastien.terrier/test_webhook',
      );
      expect(webhook.user.login).toBe('bastien.terrier');
    });

    it('should create a Webhook object according to the Github Issue Hook', () => {
      webhook = new Webhook(gitlabService, githubService);
      webhook.gitToWebhook(githubIssueEvent);

      expect(webhook.gitType).toBe(GitTypeEnum.Github);
      expect(webhook.gitEvent).toBe(GitEventEnum.NewIssue);
      expect(webhook.gitService).toBe(githubService);
      expect(webhook.issue.number).toBe(89);
      expect(webhook.issue.title).toBe('new issue');
      expect(webhook.repository.fullName).toBe('bastienterrier/test-webhook');
      expect(webhook.repository.cloneURL).toBe(
        'https://github.com/bastienterrier/test-webhook',
      );
      expect(webhook.user.login).toBe('bastienterrier');
    });
  });

  describe('isNewPREvent', () => {
    const gitlabNewPREvent = {
      object_kind: 'merge_request',
      event_type: 'merge_request',
      user: {
        name: 'Bastien Terrier',
        username: 'bastien.terrier',
        avatar_url:
          'https://secure.gravatar.com/avatar/a17bda7df8612108bc4442ce57cc6dc3?s=80&d=identicon',
      },
      project: {
        id: 10607595,
        name: 'test_webhook',
        description: '',
        web_url: 'https://gitlab.com/bastien.terrier/test_webhook',
        avatar_url: null,
        git_ssh_url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
        git_http_url: 'https://gitlab.com/bastien.terrier/test_webhook.git',
        namespace: 'bastien.terrier',
        visibility_level: 0,
        path_with_namespace: 'bastien.terrier/test_webhook',
        default_branch: 'master',
        ci_config_path: null,
        homepage: 'https://gitlab.com/bastien.terrier/test_webhook',
        url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
        ssh_url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
        http_url: 'https://gitlab.com/bastien.terrier/test_webhook.git',
      },
      object_attributes: {
        assignee_id: null,
        author_id: 3360534,
        created_at: '2019-03-14 09:23:28 UTC',
        description: '',
        head_pipeline_id: null,
        id: 25733160,
        iid: 25,
        last_edited_at: null,
        last_edited_by_id: null,
        merge_commit_sha: null,
        merge_error: null,
        merge_params: {
          force_remove_source_branch: '0',
        },
        merge_status: 'unchecked',
        merge_user_id: null,
        merge_when_pipeline_succeeds: false,
        milestone_id: null,
        source_branch: 'feature/tdd',
        source_project_id: 10607595,
        state: 'opened',
        target_branch: 'master',
        target_project_id: 10607595,
        time_estimate: 0,
        title: 'WIP: Feature/tdd',
        updated_at: '2019-03-14 09:23:28 UTC',
        updated_by_id: null,
        url:
          'https://gitlab.com/bastien.terrier/test_webhook/merge_requests/25',
        source: {
          id: 10607595,
          name: 'test_webhook',
          description: '',
          web_url: 'https://gitlab.com/bastien.terrier/test_webhook',
          avatar_url: null,
          git_ssh_url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
          git_http_url: 'https://gitlab.com/bastien.terrier/test_webhook.git',
          namespace: 'bastien.terrier',
          visibility_level: 0,
          path_with_namespace: 'bastien.terrier/test_webhook',
          default_branch: 'master',
          ci_config_path: null,
          homepage: 'https://gitlab.com/bastien.terrier/test_webhook',
          url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
          ssh_url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
          http_url: 'https://gitlab.com/bastien.terrier/test_webhook.git',
        },
        target: {
          id: 10607595,
          name: 'test_webhook',
          description: '',
          web_url: 'https://gitlab.com/bastien.terrier/test_webhook',
          avatar_url: null,
          git_ssh_url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
          git_http_url: 'https://gitlab.com/bastien.terrier/test_webhook.git',
          namespace: 'bastien.terrier',
          visibility_level: 0,
          path_with_namespace: 'bastien.terrier/test_webhook',
          default_branch: 'master',
          ci_config_path: null,
          homepage: 'https://gitlab.com/bastien.terrier/test_webhook',
          url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
          ssh_url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
          http_url: 'https://gitlab.com/bastien.terrier/test_webhook.git',
        },
        last_commit: {
          id: 'a3b2abdc7815a4cfa8998e2b91aa74ff1736ce97',
          message: 'Update README.md',
          timestamp: '2019-03-14T08:27:14Z',
          url:
            'https://gitlab.com/bastien.terrier/test_webhook/commit/a3b2abdc7815a4cfa8998e2b91aa74ff1736ce97',
          author: {
            name: 'Bastien Terrier',
            email: 'bastien.terrier@gmail.com',
          },
        },
        work_in_progress: true,
        total_time_spent: 0,
        human_total_time_spent: null,
        human_time_estimate: null,
        action: 'open',
      },
      labels: [],
      changes: {
        author_id: {
          previous: null,
          current: 3360534,
        },
        created_at: {
          previous: null,
          current: '2019-03-14 09:23:28 UTC',
        },
        description: {
          previous: null,
          current: '',
        },
        id: {
          previous: null,
          current: 25733160,
        },
        iid: {
          previous: null,
          current: 25,
        },
        merge_params: {
          previous: {},
          current: {
            force_remove_source_branch: '0',
          },
        },
        source_branch: {
          previous: null,
          current: 'feature/tdd',
        },
        source_project_id: {
          previous: null,
          current: 10607595,
        },
        target_branch: {
          previous: null,
          current: 'master',
        },
        target_project_id: {
          previous: null,
          current: 10607595,
        },
        title: {
          previous: null,
          current: 'WIP: Feature/tdd',
        },
        updated_at: {
          previous: null,
          current: '2019-03-14 09:23:28 UTC',
        },
        total_time_spent: {
          previous: null,
          current: 0,
        },
      },
      repository: {
        name: 'test_webhook',
        url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
        description: '',
        homepage: 'https://gitlab.com/bastien.terrier/test_webhook',
      },
    };
    const githubNewPREvent = {
      action: 'opened',
      number: 90,
      pull_request: {
        url:
          'https://api.github.com/repos/bastienterrier/test-webhook/pulls/90',
        id: 261084415,
        node_id: 'MDExOlB1bGxSZXF1ZXN0MjYxMDg0NDE1',
        html_url: 'https://github.com/bastienterrier/test-webhook/pull/90',
        diff_url: 'https://github.com/bastienterrier/test-webhook/pull/90.diff',
        patch_url:
          'https://github.com/bastienterrier/test-webhook/pull/90.patch',
        issue_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/issues/90',
        number: 90,
        state: 'open',
        locked: false,
        title: 'Feat/tdd',
        user: {
          login: 'bastienterrier',
          id: 25296454,
          node_id: 'MDQ6VXNlcjI1Mjk2NDU0',
          avatar_url: 'https://avatars0.githubusercontent.com/u/25296454?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/bastienterrier',
          html_url: 'https://github.com/bastienterrier',
          followers_url:
            'https://api.github.com/users/bastienterrier/followers',
          following_url:
            'https://api.github.com/users/bastienterrier/following{/other_user}',
          gists_url:
            'https://api.github.com/users/bastienterrier/gists{/gist_id}',
          starred_url:
            'https://api.github.com/users/bastienterrier/starred{/owner}{/repo}',
          subscriptions_url:
            'https://api.github.com/users/bastienterrier/subscriptions',
          organizations_url: 'https://api.github.com/users/bastienterrier/orgs',
          repos_url: 'https://api.github.com/users/bastienterrier/repos',
          events_url:
            'https://api.github.com/users/bastienterrier/events{/privacy}',
          received_events_url:
            'https://api.github.com/users/bastienterrier/received_events',
          type: 'User',
          site_admin: false,
        },
        body: '',
        created_at: '2019-03-14T09:26:18Z',
        updated_at: '2019-03-14T09:26:18Z',
        closed_at: null,
        merged_at: null,
        merge_commit_sha: null,
        assignee: null,
        assignees: [],
        requested_reviewers: [],
        requested_teams: [],
        labels: [],
        milestone: null,
        commits_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/pulls/90/commits',
        review_comments_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/pulls/90/comments',
        review_comment_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/pulls/comments{/number}',
        comments_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/issues/90/comments',
        statuses_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/statuses/f1e7b7b0eff0ac9b582a248e42534bffea0e3885',
        head: {
          label: 'bastienterrier:feat/tdd',
          ref: 'feat/tdd',
          sha: 'f1e7b7b0eff0ac9b582a248e42534bffea0e3885',
          user: {
            login: 'bastienterrier',
            id: 25296454,
            node_id: 'MDQ6VXNlcjI1Mjk2NDU0',
            avatar_url: 'https://avatars0.githubusercontent.com/u/25296454?v=4',
            gravatar_id: '',
            url: 'https://api.github.com/users/bastienterrier',
            html_url: 'https://github.com/bastienterrier',
            followers_url:
              'https://api.github.com/users/bastienterrier/followers',
            following_url:
              'https://api.github.com/users/bastienterrier/following{/other_user}',
            gists_url:
              'https://api.github.com/users/bastienterrier/gists{/gist_id}',
            starred_url:
              'https://api.github.com/users/bastienterrier/starred{/owner}{/repo}',
            subscriptions_url:
              'https://api.github.com/users/bastienterrier/subscriptions',
            organizations_url:
              'https://api.github.com/users/bastienterrier/orgs',
            repos_url: 'https://api.github.com/users/bastienterrier/repos',
            events_url:
              'https://api.github.com/users/bastienterrier/events{/privacy}',
            received_events_url:
              'https://api.github.com/users/bastienterrier/received_events',
            type: 'User',
            site_admin: false,
          },
          repo: {
            id: 169373600,
            node_id: 'MDEwOlJlcG9zaXRvcnkxNjkzNzM2MDA=',
            name: 'test-webhook',
            full_name: 'bastienterrier/test-webhook',
            private: false,
            owner: {
              login: 'bastienterrier',
              id: 25296454,
              node_id: 'MDQ6VXNlcjI1Mjk2NDU0',
              avatar_url:
                'https://avatars0.githubusercontent.com/u/25296454?v=4',
              gravatar_id: '',
              url: 'https://api.github.com/users/bastienterrier',
              html_url: 'https://github.com/bastienterrier',
              followers_url:
                'https://api.github.com/users/bastienterrier/followers',
              following_url:
                'https://api.github.com/users/bastienterrier/following{/other_user}',
              gists_url:
                'https://api.github.com/users/bastienterrier/gists{/gist_id}',
              starred_url:
                'https://api.github.com/users/bastienterrier/starred{/owner}{/repo}',
              subscriptions_url:
                'https://api.github.com/users/bastienterrier/subscriptions',
              organizations_url:
                'https://api.github.com/users/bastienterrier/orgs',
              repos_url: 'https://api.github.com/users/bastienterrier/repos',
              events_url:
                'https://api.github.com/users/bastienterrier/events{/privacy}',
              received_events_url:
                'https://api.github.com/users/bastienterrier/received_events',
              type: 'User',
              site_admin: false,
            },
            html_url: 'https://github.com/bastienterrier/test-webhook',
            description: null,
            fork: false,
            url: 'https://api.github.com/repos/bastienterrier/test-webhook',
            forks_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/forks',
            keys_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/keys{/key_id}',
            collaborators_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/collaborators{/collaborator}',
            teams_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/teams',
            hooks_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/hooks',
            issue_events_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/issues/events{/number}',
            events_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/events',
            assignees_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/assignees{/user}',
            branches_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/branches{/branch}',
            tags_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/tags',
            blobs_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/git/blobs{/sha}',
            git_tags_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/git/tags{/sha}',
            git_refs_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/git/refs{/sha}',
            trees_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/git/trees{/sha}',
            statuses_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/statuses/{sha}',
            languages_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/languages',
            stargazers_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/stargazers',
            contributors_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/contributors',
            subscribers_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/subscribers',
            subscription_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/subscription',
            commits_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/commits{/sha}',
            git_commits_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/git/commits{/sha}',
            comments_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/comments{/number}',
            issue_comment_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/issues/comments{/number}',
            contents_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/contents/{+path}',
            compare_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/compare/{base}...{head}',
            merges_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/merges',
            archive_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/{archive_format}{/ref}',
            downloads_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/downloads',
            issues_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/issues{/number}',
            pulls_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/pulls{/number}',
            milestones_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/milestones{/number}',
            notifications_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/notifications{?since,all,participating}',
            labels_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/labels{/name}',
            releases_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/releases{/id}',
            deployments_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/deployments',
            created_at: '2019-02-06T08:14:08Z',
            updated_at: '2019-02-25T13:02:50Z',
            pushed_at: '2019-03-14T08:53:55Z',
            git_url: 'git://github.com/bastienterrier/test-webhook.git',
            ssh_url: 'git@github.com:bastienterrier/test-webhook.git',
            clone_url: 'https://github.com/bastienterrier/test-webhook.git',
            svn_url: 'https://github.com/bastienterrier/test-webhook',
            homepage: null,
            size: 25427,
            stargazers_count: 0,
            watchers_count: 0,
            language: 'Shell',
            has_issues: true,
            has_projects: true,
            has_downloads: true,
            has_wiki: true,
            has_pages: true,
            forks_count: 0,
            mirror_url: null,
            archived: false,
            open_issues_count: 10,
            license: null,
            forks: 0,
            open_issues: 10,
            watchers: 0,
            default_branch: 'master',
          },
        },
        base: {
          label: 'bastienterrier:master',
          ref: 'master',
          sha: 'eb0285854e6ce28eb6a0d4917da372107773521e',
          user: {
            login: 'bastienterrier',
            id: 25296454,
            node_id: 'MDQ6VXNlcjI1Mjk2NDU0',
            avatar_url: 'https://avatars0.githubusercontent.com/u/25296454?v=4',
            gravatar_id: '',
            url: 'https://api.github.com/users/bastienterrier',
            html_url: 'https://github.com/bastienterrier',
            followers_url:
              'https://api.github.com/users/bastienterrier/followers',
            following_url:
              'https://api.github.com/users/bastienterrier/following{/other_user}',
            gists_url:
              'https://api.github.com/users/bastienterrier/gists{/gist_id}',
            starred_url:
              'https://api.github.com/users/bastienterrier/starred{/owner}{/repo}',
            subscriptions_url:
              'https://api.github.com/users/bastienterrier/subscriptions',
            organizations_url:
              'https://api.github.com/users/bastienterrier/orgs',
            repos_url: 'https://api.github.com/users/bastienterrier/repos',
            events_url:
              'https://api.github.com/users/bastienterrier/events{/privacy}',
            received_events_url:
              'https://api.github.com/users/bastienterrier/received_events',
            type: 'User',
            site_admin: false,
          },
          repo: {
            id: 169373600,
            node_id: 'MDEwOlJlcG9zaXRvcnkxNjkzNzM2MDA=',
            name: 'test-webhook',
            full_name: 'bastienterrier/test-webhook',
            private: false,
            owner: {
              login: 'bastienterrier',
              id: 25296454,
              node_id: 'MDQ6VXNlcjI1Mjk2NDU0',
              avatar_url:
                'https://avatars0.githubusercontent.com/u/25296454?v=4',
              gravatar_id: '',
              url: 'https://api.github.com/users/bastienterrier',
              html_url: 'https://github.com/bastienterrier',
              followers_url:
                'https://api.github.com/users/bastienterrier/followers',
              following_url:
                'https://api.github.com/users/bastienterrier/following{/other_user}',
              gists_url:
                'https://api.github.com/users/bastienterrier/gists{/gist_id}',
              starred_url:
                'https://api.github.com/users/bastienterrier/starred{/owner}{/repo}',
              subscriptions_url:
                'https://api.github.com/users/bastienterrier/subscriptions',
              organizations_url:
                'https://api.github.com/users/bastienterrier/orgs',
              repos_url: 'https://api.github.com/users/bastienterrier/repos',
              events_url:
                'https://api.github.com/users/bastienterrier/events{/privacy}',
              received_events_url:
                'https://api.github.com/users/bastienterrier/received_events',
              type: 'User',
              site_admin: false,
            },
            html_url: 'https://github.com/bastienterrier/test-webhook',
            description: null,
            fork: false,
            url: 'https://api.github.com/repos/bastienterrier/test-webhook',
            forks_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/forks',
            keys_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/keys{/key_id}',
            collaborators_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/collaborators{/collaborator}',
            teams_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/teams',
            hooks_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/hooks',
            issue_events_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/issues/events{/number}',
            events_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/events',
            assignees_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/assignees{/user}',
            branches_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/branches{/branch}',
            tags_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/tags',
            blobs_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/git/blobs{/sha}',
            git_tags_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/git/tags{/sha}',
            git_refs_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/git/refs{/sha}',
            trees_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/git/trees{/sha}',
            statuses_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/statuses/{sha}',
            languages_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/languages',
            stargazers_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/stargazers',
            contributors_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/contributors',
            subscribers_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/subscribers',
            subscription_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/subscription',
            commits_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/commits{/sha}',
            git_commits_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/git/commits{/sha}',
            comments_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/comments{/number}',
            issue_comment_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/issues/comments{/number}',
            contents_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/contents/{+path}',
            compare_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/compare/{base}...{head}',
            merges_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/merges',
            archive_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/{archive_format}{/ref}',
            downloads_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/downloads',
            issues_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/issues{/number}',
            pulls_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/pulls{/number}',
            milestones_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/milestones{/number}',
            notifications_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/notifications{?since,all,participating}',
            labels_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/labels{/name}',
            releases_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/releases{/id}',
            deployments_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/deployments',
            created_at: '2019-02-06T08:14:08Z',
            updated_at: '2019-02-25T13:02:50Z',
            pushed_at: '2019-03-14T08:53:55Z',
            git_url: 'git://github.com/bastienterrier/test-webhook.git',
            ssh_url: 'git@github.com:bastienterrier/test-webhook.git',
            clone_url: 'https://github.com/bastienterrier/test-webhook.git',
            svn_url: 'https://github.com/bastienterrier/test-webhook',
            homepage: null,
            size: 25427,
            stargazers_count: 0,
            watchers_count: 0,
            language: 'Shell',
            has_issues: true,
            has_projects: true,
            has_downloads: true,
            has_wiki: true,
            has_pages: true,
            forks_count: 0,
            mirror_url: null,
            archived: false,
            open_issues_count: 10,
            license: null,
            forks: 0,
            open_issues: 10,
            watchers: 0,
            default_branch: 'master',
          },
        },
        _links: {
          self: {
            href:
              'https://api.github.com/repos/bastienterrier/test-webhook/pulls/90',
          },
          html: {
            href: 'https://github.com/bastienterrier/test-webhook/pull/90',
          },
          issue: {
            href:
              'https://api.github.com/repos/bastienterrier/test-webhook/issues/90',
          },
          comments: {
            href:
              'https://api.github.com/repos/bastienterrier/test-webhook/issues/90/comments',
          },
          review_comments: {
            href:
              'https://api.github.com/repos/bastienterrier/test-webhook/pulls/90/comments',
          },
          review_comment: {
            href:
              'https://api.github.com/repos/bastienterrier/test-webhook/pulls/comments{/number}',
          },
          commits: {
            href:
              'https://api.github.com/repos/bastienterrier/test-webhook/pulls/90/commits',
          },
          statuses: {
            href:
              'https://api.github.com/repos/bastienterrier/test-webhook/statuses/f1e7b7b0eff0ac9b582a248e42534bffea0e3885',
          },
        },
        author_association: 'OWNER',
        draft: false,
        merged: false,
        mergeable: null,
        rebaseable: null,
        mergeable_state: 'unknown',
        merged_by: null,
        comments: 0,
        review_comments: 0,
        maintainer_can_modify: false,
        commits: 181,
        additions: 849,
        deletions: 339,
        changed_files: 266,
      },
      repository: {
        id: 169373600,
        node_id: 'MDEwOlJlcG9zaXRvcnkxNjkzNzM2MDA=',
        name: 'test-webhook',
        full_name: 'bastienterrier/test-webhook',
        private: false,
        owner: {
          login: 'bastienterrier',
          id: 25296454,
          node_id: 'MDQ6VXNlcjI1Mjk2NDU0',
          avatar_url: 'https://avatars0.githubusercontent.com/u/25296454?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/bastienterrier',
          html_url: 'https://github.com/bastienterrier',
          followers_url:
            'https://api.github.com/users/bastienterrier/followers',
          following_url:
            'https://api.github.com/users/bastienterrier/following{/other_user}',
          gists_url:
            'https://api.github.com/users/bastienterrier/gists{/gist_id}',
          starred_url:
            'https://api.github.com/users/bastienterrier/starred{/owner}{/repo}',
          subscriptions_url:
            'https://api.github.com/users/bastienterrier/subscriptions',
          organizations_url: 'https://api.github.com/users/bastienterrier/orgs',
          repos_url: 'https://api.github.com/users/bastienterrier/repos',
          events_url:
            'https://api.github.com/users/bastienterrier/events{/privacy}',
          received_events_url:
            'https://api.github.com/users/bastienterrier/received_events',
          type: 'User',
          site_admin: false,
        },
        html_url: 'https://github.com/bastienterrier/test-webhook',
        description: null,
        fork: false,
        url: 'https://api.github.com/repos/bastienterrier/test-webhook',
        forks_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/forks',
        keys_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/keys{/key_id}',
        collaborators_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/collaborators{/collaborator}',
        teams_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/teams',
        hooks_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/hooks',
        issue_events_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/issues/events{/number}',
        events_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/events',
        assignees_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/assignees{/user}',
        branches_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/branches{/branch}',
        tags_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/tags',
        blobs_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/git/blobs{/sha}',
        git_tags_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/git/tags{/sha}',
        git_refs_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/git/refs{/sha}',
        trees_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/git/trees{/sha}',
        statuses_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/statuses/{sha}',
        languages_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/languages',
        stargazers_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/stargazers',
        contributors_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/contributors',
        subscribers_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/subscribers',
        subscription_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/subscription',
        commits_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/commits{/sha}',
        git_commits_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/git/commits{/sha}',
        comments_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/comments{/number}',
        issue_comment_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/issues/comments{/number}',
        contents_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/contents/{+path}',
        compare_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/compare/{base}...{head}',
        merges_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/merges',
        archive_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/{archive_format}{/ref}',
        downloads_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/downloads',
        issues_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/issues{/number}',
        pulls_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/pulls{/number}',
        milestones_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/milestones{/number}',
        notifications_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/notifications{?since,all,participating}',
        labels_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/labels{/name}',
        releases_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/releases{/id}',
        deployments_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/deployments',
        created_at: '2019-02-06T08:14:08Z',
        updated_at: '2019-02-25T13:02:50Z',
        pushed_at: '2019-03-14T08:53:55Z',
        git_url: 'git://github.com/bastienterrier/test-webhook.git',
        ssh_url: 'git@github.com:bastienterrier/test-webhook.git',
        clone_url: 'https://github.com/bastienterrier/test-webhook.git',
        svn_url: 'https://github.com/bastienterrier/test-webhook',
        homepage: null,
        size: 25427,
        stargazers_count: 0,
        watchers_count: 0,
        language: 'Shell',
        has_issues: true,
        has_projects: true,
        has_downloads: true,
        has_wiki: true,
        has_pages: true,
        forks_count: 0,
        mirror_url: null,
        archived: false,
        open_issues_count: 10,
        license: null,
        forks: 0,
        open_issues: 10,
        watchers: 0,
        default_branch: 'master',
      },
      sender: {
        login: 'bastienterrier',
        id: 25296454,
        node_id: 'MDQ6VXNlcjI1Mjk2NDU0',
        avatar_url: 'https://avatars0.githubusercontent.com/u/25296454?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/bastienterrier',
        html_url: 'https://github.com/bastienterrier',
        followers_url: 'https://api.github.com/users/bastienterrier/followers',
        following_url:
          'https://api.github.com/users/bastienterrier/following{/other_user}',
        gists_url:
          'https://api.github.com/users/bastienterrier/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/bastienterrier/starred{/owner}{/repo}',
        subscriptions_url:
          'https://api.github.com/users/bastienterrier/subscriptions',
        organizations_url: 'https://api.github.com/users/bastienterrier/orgs',
        repos_url: 'https://api.github.com/users/bastienterrier/repos',
        events_url:
          'https://api.github.com/users/bastienterrier/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/bastienterrier/received_events',
        type: 'User',
        site_admin: false,
      },
    };

    it('isGitlabNewPREvent should equal "true"', () => {
      expect(utils.isGitlabNewPREvent(gitlabNewPREvent)).toBe(true);
    });
    it('isGitlabNewPREvent should equal "false"', () => {
      expect(utils.isGitlabNewPREvent(githubNewPREvent)).toBe(false);
    });
    it('isGithubNewPREvent should equal "true"', () => {
      expect(utils.isGithubNewPREvent(githubNewPREvent)).toBe(true);
    });
    it('isGithubNewPREvent should equal "false"', () => {
      expect(utils.isGithubNewPREvent(gitlabNewPREvent)).toBe(false);
    });

    it('should create a Webhook object according to the Gitlab PR Hook', () => {
      webhook = new Webhook(gitlabService, githubService);
      webhook.gitToWebhook(gitlabNewPREvent);

      expect(webhook.gitType).toBe(GitTypeEnum.Gitlab);
      expect(webhook.gitEvent).toBe(GitEventEnum.NewPR);
      expect(webhook.projectId).toBe(10607595);
      expect(webhook.gitService).toBe(gitlabService);
      expect(webhook.pullRequest.number).toBe(25);
      expect(webhook.pullRequest.title).toBe('WIP: Feature/tdd');
      expect(webhook.pullRequest.description).toBe('');
      expect(webhook.pullRequest.sourceBranch).toBe('feature/tdd');
      expect(webhook.pullRequest.targetBranch).toBe('master');
      expect(webhook.repository.cloneURL).toBe(
        'https://gitlab.com/bastien.terrier/test_webhook',
      );
      expect(webhook.user.login).toBe('bastien.terrier');
      expect(webhook.pullRequest.user.login).toBe('bastien.terrier');
    });

    it('should create a Webhook object according to the Github PR Hook', () => {
      webhook = new Webhook(gitlabService, githubService);
      webhook.gitToWebhook(githubNewPREvent);

      expect(webhook.gitType).toBe(GitTypeEnum.Github);
      expect(webhook.gitEvent).toBe(GitEventEnum.NewPR);
      expect(webhook.gitService).toBe(githubService);
      expect(webhook.pullRequest.number).toBe(90);
      expect(webhook.pullRequest.title).toBe('Feat/tdd');
      expect(webhook.pullRequest.description).toBe('');
      expect(webhook.pullRequest.sourceBranch).toBe('feat/tdd');
      expect(webhook.pullRequest.targetBranch).toBe('master');
      expect(webhook.repository.fullName).toBe('bastienterrier/test-webhook');
      expect(webhook.repository.cloneURL).toBe(
        'https://github.com/bastienterrier/test-webhook',
      );
      expect(webhook.user.login).toBe('bastienterrier');
      expect(webhook.pullRequest.user.login).toBe('bastienterrier');
    });
  });

  describe('isIssueCommentEvent', () => {
    const githubIssueCommentEvent = {
      action: 'created',
      issue: {
        url:
          'https://api.github.com/repos/bastienterrier/test-webhook/issues/91',
        repository_url:
          'https://api.github.com/repos/bastienterrier/test-webhook',
        labels_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/issues/91/labels{/name}',
        comments_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/issues/91/comments',
        events_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/issues/91/events',
        html_url: 'https://github.com/bastienterrier/test-webhook/issues/91',
        id: 424904837,
        node_id: 'MDU6SXNzdWU0MjQ5MDQ4Mzc=',
        number: 91,
        title: 'testing new name',
        user: {
          login: 'bastienterrier',
          id: 25296454,
          node_id: 'MDQ6VXNlcjI1Mjk2NDU0',
          avatar_url: 'https://avatars0.githubusercontent.com/u/25296454?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/bastienterrier',
          html_url: 'https://github.com/bastienterrier',
          followers_url:
            'https://api.github.com/users/bastienterrier/followers',
          following_url:
            'https://api.github.com/users/bastienterrier/following{/other_user}',
          gists_url:
            'https://api.github.com/users/bastienterrier/gists{/gist_id}',
          starred_url:
            'https://api.github.com/users/bastienterrier/starred{/owner}{/repo}',
          subscriptions_url:
            'https://api.github.com/users/bastienterrier/subscriptions',
          organizations_url: 'https://api.github.com/users/bastienterrier/orgs',
          repos_url: 'https://api.github.com/users/bastienterrier/repos',
          events_url:
            'https://api.github.com/users/bastienterrier/events{/privacy}',
          received_events_url:
            'https://api.github.com/users/bastienterrier/received_events',
          type: 'User',
          site_admin: false,
        },
        labels: [],
        state: 'open',
        locked: false,
        assignee: null,
        assignees: [],
        milestone: null,
        comments: 4,
        created_at: '2019-03-25T13:34:34Z',
        updated_at: '2019-04-01T12:15:16Z',
        closed_at: null,
        author_association: 'OWNER',
        body: '',
      },
      comment: {
        url:
          'https://api.github.com/repos/bastienterrier/test-webhook/issues/comments/478554801',
        html_url:
          'https://github.com/bastienterrier/test-webhook/issues/91#issuecomment-478554801',
        issue_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/issues/91',
        id: 478554801,
        node_id: 'MDEyOklzc3VlQ29tbWVudDQ3ODU1NDgwMQ==',
        user: {
          login: 'bastienterrier',
          id: 25296454,
          node_id: 'MDQ6VXNlcjI1Mjk2NDU0',
          avatar_url: 'https://avatars0.githubusercontent.com/u/25296454?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/bastienterrier',
          html_url: 'https://github.com/bastienterrier',
          followers_url:
            'https://api.github.com/users/bastienterrier/followers',
          following_url:
            'https://api.github.com/users/bastienterrier/following{/other_user}',
          gists_url:
            'https://api.github.com/users/bastienterrier/gists{/gist_id}',
          starred_url:
            'https://api.github.com/users/bastienterrier/starred{/owner}{/repo}',
          subscriptions_url:
            'https://api.github.com/users/bastienterrier/subscriptions',
          organizations_url: 'https://api.github.com/users/bastienterrier/orgs',
          repos_url: 'https://api.github.com/users/bastienterrier/repos',
          events_url:
            'https://api.github.com/users/bastienterrier/events{/privacy}',
          received_events_url:
            'https://api.github.com/users/bastienterrier/received_events',
          type: 'User',
          site_admin: false,
        },
        created_at: '2019-04-01T12:15:16Z',
        updated_at: '2019-04-01T12:15:16Z',
        author_association: 'OWNER',
        body: 'test comment',
      },
      repository: {
        id: 169373600,
        node_id: 'MDEwOlJlcG9zaXRvcnkxNjkzNzM2MDA=',
        name: 'test-webhook',
        full_name: 'bastienterrier/test-webhook',
        private: false,
        owner: {
          login: 'bastienterrier',
          id: 25296454,
          node_id: 'MDQ6VXNlcjI1Mjk2NDU0',
          avatar_url: 'https://avatars0.githubusercontent.com/u/25296454?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/bastienterrier',
          html_url: 'https://github.com/bastienterrier',
          followers_url:
            'https://api.github.com/users/bastienterrier/followers',
          following_url:
            'https://api.github.com/users/bastienterrier/following{/other_user}',
          gists_url:
            'https://api.github.com/users/bastienterrier/gists{/gist_id}',
          starred_url:
            'https://api.github.com/users/bastienterrier/starred{/owner}{/repo}',
          subscriptions_url:
            'https://api.github.com/users/bastienterrier/subscriptions',
          organizations_url: 'https://api.github.com/users/bastienterrier/orgs',
          repos_url: 'https://api.github.com/users/bastienterrier/repos',
          events_url:
            'https://api.github.com/users/bastienterrier/events{/privacy}',
          received_events_url:
            'https://api.github.com/users/bastienterrier/received_events',
          type: 'User',
          site_admin: false,
        },
        html_url: 'https://github.com/bastienterrier/test-webhook',
        description: null,
        fork: false,
        url: 'https://api.github.com/repos/bastienterrier/test-webhook',
        forks_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/forks',
        keys_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/keys{/key_id}',
        collaborators_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/collaborators{/collaborator}',
        teams_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/teams',
        hooks_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/hooks',
        issue_events_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/issues/events{/number}',
        events_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/events',
        assignees_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/assignees{/user}',
        branches_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/branches{/branch}',
        tags_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/tags',
        blobs_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/git/blobs{/sha}',
        git_tags_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/git/tags{/sha}',
        git_refs_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/git/refs{/sha}',
        trees_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/git/trees{/sha}',
        statuses_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/statuses/{sha}',
        languages_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/languages',
        stargazers_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/stargazers',
        contributors_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/contributors',
        subscribers_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/subscribers',
        subscription_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/subscription',
        commits_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/commits{/sha}',
        git_commits_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/git/commits{/sha}',
        comments_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/comments{/number}',
        issue_comment_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/issues/comments{/number}',
        contents_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/contents/{+path}',
        compare_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/compare/{base}...{head}',
        merges_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/merges',
        archive_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/{archive_format}{/ref}',
        downloads_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/downloads',
        issues_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/issues{/number}',
        pulls_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/pulls{/number}',
        milestones_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/milestones{/number}',
        notifications_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/notifications{?since,all,participating}',
        labels_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/labels{/name}',
        releases_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/releases{/id}',
        deployments_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/deployments',
        created_at: '2019-02-06T08:14:08Z',
        updated_at: '2019-04-01T09:54:15Z',
        pushed_at: '2019-04-01T09:55:07Z',
        git_url: 'git://github.com/bastienterrier/test-webhook.git',
        ssh_url: 'git@github.com:bastienterrier/test-webhook.git',
        clone_url: 'https://github.com/bastienterrier/test-webhook.git',
        svn_url: 'https://github.com/bastienterrier/test-webhook',
        homepage: null,
        size: 25451,
        stargazers_count: 0,
        watchers_count: 0,
        language: 'JavaScript',
        has_issues: true,
        has_projects: true,
        has_downloads: true,
        has_wiki: true,
        has_pages: false,
        forks_count: 0,
        mirror_url: null,
        archived: false,
        open_issues_count: 10,
        license: null,
        forks: 0,
        open_issues: 10,
        watchers: 0,
        default_branch: 'master',
      },
      sender: {
        login: 'bastienterrier',
        id: 25296454,
        node_id: 'MDQ6VXNlcjI1Mjk2NDU0',
        avatar_url: 'https://avatars0.githubusercontent.com/u/25296454?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/bastienterrier',
        html_url: 'https://github.com/bastienterrier',
        followers_url: 'https://api.github.com/users/bastienterrier/followers',
        following_url:
          'https://api.github.com/users/bastienterrier/following{/other_user}',
        gists_url:
          'https://api.github.com/users/bastienterrier/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/bastienterrier/starred{/owner}{/repo}',
        subscriptions_url:
          'https://api.github.com/users/bastienterrier/subscriptions',
        organizations_url: 'https://api.github.com/users/bastienterrier/orgs',
        repos_url: 'https://api.github.com/users/bastienterrier/repos',
        events_url:
          'https://api.github.com/users/bastienterrier/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/bastienterrier/received_events',
        type: 'User',
        site_admin: false,
      },
    };
    const gitlabIssueCommentEvent = {
      object_kind: 'note',
      event_type: 'note',
      user: {
        name: 'Bastien Terrier',
        username: 'bastien.terrier',
        avatar_url:
          'https://secure.gravatar.com/avatar/a17bda7df8612108bc4442ce57cc6dc3?s=80&d=identicon',
      },
      project_id: 10607595,
      project: {
        id: 10607595,
        name: 'test_webhook',
        description: '',
        web_url: 'https://gitlab.com/bastien.terrier/test_webhook',
        avatar_url: null,
        git_ssh_url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
        git_http_url: 'https://gitlab.com/bastien.terrier/test_webhook.git',
        namespace: 'bastien.terrier',
        visibility_level: 20,
        path_with_namespace: 'bastien.terrier/test_webhook',
        default_branch: 'master',
        ci_config_path: null,
        homepage: 'https://gitlab.com/bastien.terrier/test_webhook',
        url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
        ssh_url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
        http_url: 'https://gitlab.com/bastien.terrier/test_webhook.git',
      },
      object_attributes: {
        attachment: null,
        author_id: 3360534,
        change_position: null,
        commit_id: null,
        created_at: '2019-04-01 12:15:45 UTC',
        discussion_id: '409deb3c3e22663067bbcba17348426e926b9476',
        id: 156036431,
        line_code: null,
        note: 'testing comment',
        noteable_id: 19427200,
        noteable_type: 'Issue',
        original_position: null,
        position: null,
        project_id: 10607595,
        resolved_at: null,
        resolved_by_id: null,
        resolved_by_push: null,
        st_diff: null,
        system: false,
        type: null,
        updated_at: '2019-04-01 12:15:45 UTC',
        updated_by_id: null,
        description: 'testing comment',
        url:
          'https://gitlab.com/bastien.terrier/test_webhook/issues/21#note_156036431',
      },
      repository: {
        name: 'test_webhook',
        url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
        description: '',
        homepage: 'https://gitlab.com/bastien.terrier/test_webhook',
      },
      issue: {
        author_id: 3360534,
        closed_at: null,
        confidential: false,
        created_at: '2019-03-25 13:32:49 UTC',
        description: '',
        due_date: null,
        id: 19427200,
        iid: 21,
        last_edited_at: null,
        last_edited_by_id: null,
        milestone_id: null,
        moved_to_id: null,
        project_id: 10607595,
        relative_position: 1073752323,
        state: 'opened',
        time_estimate: 0,
        title: 'sdvsdv',
        updated_at: '2019-04-01 12:15:46 UTC',
        updated_by_id: null,
        weight: null,
        url: 'https://gitlab.com/bastien.terrier/test_webhook/issues/21',
        total_time_spent: 0,
        human_total_time_spent: null,
        human_time_estimate: null,
        assignee_ids: [],
        assignee_id: null,
      },
    };

    it('isGitlabIssueCommentEvent should equal "true"', () => {
      expect(utils.isGitlabIssueCommentEvent(gitlabIssueCommentEvent)).toBe(
        true,
      );
    });
    it('isGitlabIssueCommentEvent should equal "false"', () => {
      expect(utils.isGitlabIssueCommentEvent(githubIssueCommentEvent)).toBe(
        false,
      );
    });
    it('isGithubIssueCommentEvent should equal "true"', () => {
      expect(utils.isGithubIssueCommentEvent(githubIssueCommentEvent)).toBe(
        true,
      );
    });
    it('isGithubIssueCommentEvent should equal "false"', () => {
      expect(utils.isGithubIssueCommentEvent(gitlabIssueCommentEvent)).toBe(
        false,
      );
    });

    it('should create a Webhook object according to the Gitlab Issue Comment Hook', () => {
      webhook = new Webhook(gitlabService, githubService);
      webhook.gitToWebhook(gitlabIssueCommentEvent);

      expect(webhook.gitType).toBe(GitTypeEnum.Gitlab);
      expect(webhook.gitEvent).toBe(GitEventEnum.NewIssueComment);
      expect(webhook.projectId).toBe(10607595);
      expect(webhook.gitService).toBe(gitlabService);
      expect(webhook.comment.id).toBe(156036431);
      expect(webhook.comment.description).toBe('testing comment');
      expect(webhook.issue.title).toBe('sdvsdv');
      expect(webhook.issue.number).toBe(21);
      expect(webhook.repository.cloneURL).toBe(
        'https://gitlab.com/bastien.terrier/test_webhook',
      );
      expect(webhook.user.login).toBe('bastien.terrier');
    });

    it('should create a Webhook object according to the Github Issue Comment Hook', () => {
      webhook = new Webhook(gitlabService, githubService);
      webhook.gitToWebhook(githubIssueCommentEvent);

      expect(webhook.gitType).toBe(GitTypeEnum.Github);
      expect(webhook.gitEvent).toBe(GitEventEnum.NewIssueComment);
      expect(webhook.gitService).toBe(githubService);
      expect(webhook.comment.id).toBe(478554801);
      expect(webhook.comment.description).toBe('test comment');
      expect(webhook.issue.title).toBe('testing new name');
      expect(webhook.issue.number).toBe(91);
      expect(webhook.repository.fullName).toBe('bastienterrier/test-webhook');
      expect(webhook.repository.cloneURL).toBe(
        'https://github.com/bastienterrier/test-webhook',
      );
      expect(webhook.user.login).toBe('bastienterrier');
    });
  });

  describe('isPRCommentEvent', () => {
    const githubPRCommentEvent = {
      action: 'created',
      issue: {
        url:
          'https://api.github.com/repos/bastienterrier/test-webhook/issues/93',
        repository_url:
          'https://api.github.com/repos/bastienterrier/test-webhook',
        labels_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/issues/93/labels{/name}',
        comments_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/issues/93/comments',
        events_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/issues/93/events',
        html_url: 'https://github.com/bastienterrier/test-webhook/pull/93',
        id: 427613286,
        node_id: 'MDExOlB1bGxSZXF1ZXN0MjY2MTY5NDgz',
        number: 93,
        title: 'ezfrthr',
        user: {
          login: 'bastienterrier',
          id: 25296454,
          node_id: 'MDQ6VXNlcjI1Mjk2NDU0',
          avatar_url: 'https://avatars0.githubusercontent.com/u/25296454?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/bastienterrier',
          html_url: 'https://github.com/bastienterrier',
          followers_url:
            'https://api.github.com/users/bastienterrier/followers',
          following_url:
            'https://api.github.com/users/bastienterrier/following{/other_user}',
          gists_url:
            'https://api.github.com/users/bastienterrier/gists{/gist_id}',
          starred_url:
            'https://api.github.com/users/bastienterrier/starred{/owner}{/repo}',
          subscriptions_url:
            'https://api.github.com/users/bastienterrier/subscriptions',
          organizations_url: 'https://api.github.com/users/bastienterrier/orgs',
          repos_url: 'https://api.github.com/users/bastienterrier/repos',
          events_url:
            'https://api.github.com/users/bastienterrier/events{/privacy}',
          received_events_url:
            'https://api.github.com/users/bastienterrier/received_events',
          type: 'User',
          site_admin: false,
        },
        labels: [],
        state: 'open',
        locked: false,
        assignee: null,
        assignees: [],
        milestone: null,
        comments: 1,
        created_at: '2019-04-01T09:55:06Z',
        updated_at: '2019-04-01T12:18:12Z',
        closed_at: null,
        author_association: 'OWNER',
        pull_request: {
          url:
            'https://api.github.com/repos/bastienterrier/test-webhook/pulls/93',
          html_url: 'https://github.com/bastienterrier/test-webhook/pull/93',
          diff_url:
            'https://github.com/bastienterrier/test-webhook/pull/93.diff',
          patch_url:
            'https://github.com/bastienterrier/test-webhook/pull/93.patch',
        },
        body: '',
      },
      comment: {
        url:
          'https://api.github.com/repos/bastienterrier/test-webhook/issues/comments/478555715',
        html_url:
          'https://github.com/bastienterrier/test-webhook/pull/93#issuecomment-478555715',
        issue_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/issues/93',
        id: 478555715,
        node_id: 'MDEyOklzc3VlQ29tbWVudDQ3ODU1NTcxNQ==',
        user: {
          login: 'bastienterrier',
          id: 25296454,
          node_id: 'MDQ6VXNlcjI1Mjk2NDU0',
          avatar_url: 'https://avatars0.githubusercontent.com/u/25296454?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/bastienterrier',
          html_url: 'https://github.com/bastienterrier',
          followers_url:
            'https://api.github.com/users/bastienterrier/followers',
          following_url:
            'https://api.github.com/users/bastienterrier/following{/other_user}',
          gists_url:
            'https://api.github.com/users/bastienterrier/gists{/gist_id}',
          starred_url:
            'https://api.github.com/users/bastienterrier/starred{/owner}{/repo}',
          subscriptions_url:
            'https://api.github.com/users/bastienterrier/subscriptions',
          organizations_url: 'https://api.github.com/users/bastienterrier/orgs',
          repos_url: 'https://api.github.com/users/bastienterrier/repos',
          events_url:
            'https://api.github.com/users/bastienterrier/events{/privacy}',
          received_events_url:
            'https://api.github.com/users/bastienterrier/received_events',
          type: 'User',
          site_admin: false,
        },
        created_at: '2019-04-01T12:18:12Z',
        updated_at: '2019-04-01T12:18:12Z',
        author_association: 'OWNER',
        body: 'test comment on PR',
      },
      repository: {
        id: 169373600,
        node_id: 'MDEwOlJlcG9zaXRvcnkxNjkzNzM2MDA=',
        name: 'test-webhook',
        full_name: 'bastienterrier/test-webhook',
        private: false,
        owner: {
          login: 'bastienterrier',
          id: 25296454,
          node_id: 'MDQ6VXNlcjI1Mjk2NDU0',
          avatar_url: 'https://avatars0.githubusercontent.com/u/25296454?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/bastienterrier',
          html_url: 'https://github.com/bastienterrier',
          followers_url:
            'https://api.github.com/users/bastienterrier/followers',
          following_url:
            'https://api.github.com/users/bastienterrier/following{/other_user}',
          gists_url:
            'https://api.github.com/users/bastienterrier/gists{/gist_id}',
          starred_url:
            'https://api.github.com/users/bastienterrier/starred{/owner}{/repo}',
          subscriptions_url:
            'https://api.github.com/users/bastienterrier/subscriptions',
          organizations_url: 'https://api.github.com/users/bastienterrier/orgs',
          repos_url: 'https://api.github.com/users/bastienterrier/repos',
          events_url:
            'https://api.github.com/users/bastienterrier/events{/privacy}',
          received_events_url:
            'https://api.github.com/users/bastienterrier/received_events',
          type: 'User',
          site_admin: false,
        },
        html_url: 'https://github.com/bastienterrier/test-webhook',
        description: null,
        fork: false,
        url: 'https://api.github.com/repos/bastienterrier/test-webhook',
        forks_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/forks',
        keys_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/keys{/key_id}',
        collaborators_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/collaborators{/collaborator}',
        teams_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/teams',
        hooks_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/hooks',
        issue_events_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/issues/events{/number}',
        events_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/events',
        assignees_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/assignees{/user}',
        branches_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/branches{/branch}',
        tags_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/tags',
        blobs_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/git/blobs{/sha}',
        git_tags_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/git/tags{/sha}',
        git_refs_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/git/refs{/sha}',
        trees_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/git/trees{/sha}',
        statuses_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/statuses/{sha}',
        languages_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/languages',
        stargazers_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/stargazers',
        contributors_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/contributors',
        subscribers_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/subscribers',
        subscription_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/subscription',
        commits_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/commits{/sha}',
        git_commits_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/git/commits{/sha}',
        comments_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/comments{/number}',
        issue_comment_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/issues/comments{/number}',
        contents_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/contents/{+path}',
        compare_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/compare/{base}...{head}',
        merges_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/merges',
        archive_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/{archive_format}{/ref}',
        downloads_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/downloads',
        issues_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/issues{/number}',
        pulls_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/pulls{/number}',
        milestones_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/milestones{/number}',
        notifications_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/notifications{?since,all,participating}',
        labels_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/labels{/name}',
        releases_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/releases{/id}',
        deployments_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/deployments',
        created_at: '2019-02-06T08:14:08Z',
        updated_at: '2019-04-01T09:54:15Z',
        pushed_at: '2019-04-01T09:55:07Z',
        git_url: 'git://github.com/bastienterrier/test-webhook.git',
        ssh_url: 'git@github.com:bastienterrier/test-webhook.git',
        clone_url: 'https://github.com/bastienterrier/test-webhook.git',
        svn_url: 'https://github.com/bastienterrier/test-webhook',
        homepage: null,
        size: 25451,
        stargazers_count: 0,
        watchers_count: 0,
        language: 'JavaScript',
        has_issues: true,
        has_projects: true,
        has_downloads: true,
        has_wiki: true,
        has_pages: false,
        forks_count: 0,
        mirror_url: null,
        archived: false,
        open_issues_count: 10,
        license: null,
        forks: 0,
        open_issues: 10,
        watchers: 0,
        default_branch: 'master',
      },
      sender: {
        login: 'bastienterrier',
        id: 25296454,
        node_id: 'MDQ6VXNlcjI1Mjk2NDU0',
        avatar_url: 'https://avatars0.githubusercontent.com/u/25296454?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/bastienterrier',
        html_url: 'https://github.com/bastienterrier',
        followers_url: 'https://api.github.com/users/bastienterrier/followers',
        following_url:
          'https://api.github.com/users/bastienterrier/following{/other_user}',
        gists_url:
          'https://api.github.com/users/bastienterrier/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/bastienterrier/starred{/owner}{/repo}',
        subscriptions_url:
          'https://api.github.com/users/bastienterrier/subscriptions',
        organizations_url: 'https://api.github.com/users/bastienterrier/orgs',
        repos_url: 'https://api.github.com/users/bastienterrier/repos',
        events_url:
          'https://api.github.com/users/bastienterrier/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/bastienterrier/received_events',
        type: 'User',
        site_admin: false,
      },
    };
    const gitlabPRCommentEvent = {
      object_kind: 'note',
      event_type: 'note',
      user: {
        name: 'Bastien Terrier',
        username: 'bastien.terrier',
        avatar_url:
          'https://secure.gravatar.com/avatar/a17bda7df8612108bc4442ce57cc6dc3?s=80&d=identicon',
      },
      project_id: 10607595,
      project: {
        id: 10607595,
        name: 'test_webhook',
        description: '',
        web_url: 'https://gitlab.com/bastien.terrier/test_webhook',
        avatar_url: null,
        git_ssh_url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
        git_http_url: 'https://gitlab.com/bastien.terrier/test_webhook.git',
        namespace: 'bastien.terrier',
        visibility_level: 20,
        path_with_namespace: 'bastien.terrier/test_webhook',
        default_branch: 'master',
        ci_config_path: null,
        homepage: 'https://gitlab.com/bastien.terrier/test_webhook',
        url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
        ssh_url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
        http_url: 'https://gitlab.com/bastien.terrier/test_webhook.git',
      },
      object_attributes: {
        attachment: null,
        author_id: 3360534,
        change_position: null,
        commit_id: null,
        created_at: '2019-04-01 12:18:29 UTC',
        discussion_id: 'fb8d3b587a0f462b10c566ef003c035e95d9d254',
        id: 156037494,
        line_code: null,
        note: 'test comment on MR',
        noteable_id: 25733160,
        noteable_type: 'MergeRequest',
        original_position: null,
        position: null,
        project_id: 10607595,
        resolved_at: null,
        resolved_by_id: null,
        resolved_by_push: null,
        st_diff: null,
        system: false,
        type: null,
        updated_at: '2019-04-01 12:18:29 UTC',
        updated_by_id: null,
        description: 'test comment on MR',
        url:
          'https://gitlab.com/bastien.terrier/test_webhook/merge_requests/25#note_156037494',
      },
      repository: {
        name: 'test_webhook',
        url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
        description: '',
        homepage: 'https://gitlab.com/bastien.terrier/test_webhook',
      },
      merge_request: {
        assignee_id: null,
        author_id: 3360534,
        created_at: '2019-03-14 09:23:28 UTC',
        description: '',
        head_pipeline_id: null,
        id: 25733160,
        iid: 25,
        last_edited_at: null,
        last_edited_by_id: null,
        merge_commit_sha: null,
        merge_error: null,
        merge_params: {
          force_remove_source_branch: '0',
        },
        merge_status: 'cannot_be_merged',
        merge_user_id: null,
        merge_when_pipeline_succeeds: false,
        milestone_id: null,
        source_branch: 'feature/tdd',
        source_project_id: 10607595,
        state: 'opened',
        target_branch: 'master',
        target_project_id: 10607595,
        time_estimate: 0,
        title: 'WIP: Feature/tdd',
        updated_at: '2019-04-01 12:18:29 UTC',
        updated_by_id: null,
        url:
          'https://gitlab.com/bastien.terrier/test_webhook/merge_requests/25',
        source: {
          id: 10607595,
          name: 'test_webhook',
          description: '',
          web_url: 'https://gitlab.com/bastien.terrier/test_webhook',
          avatar_url: null,
          git_ssh_url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
          git_http_url: 'https://gitlab.com/bastien.terrier/test_webhook.git',
          namespace: 'bastien.terrier',
          visibility_level: 20,
          path_with_namespace: 'bastien.terrier/test_webhook',
          default_branch: 'master',
          ci_config_path: null,
          homepage: 'https://gitlab.com/bastien.terrier/test_webhook',
          url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
          ssh_url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
          http_url: 'https://gitlab.com/bastien.terrier/test_webhook.git',
        },
        target: {
          id: 10607595,
          name: 'test_webhook',
          description: '',
          web_url: 'https://gitlab.com/bastien.terrier/test_webhook',
          avatar_url: null,
          git_ssh_url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
          git_http_url: 'https://gitlab.com/bastien.terrier/test_webhook.git',
          namespace: 'bastien.terrier',
          visibility_level: 20,
          path_with_namespace: 'bastien.terrier/test_webhook',
          default_branch: 'master',
          ci_config_path: null,
          homepage: 'https://gitlab.com/bastien.terrier/test_webhook',
          url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
          ssh_url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
          http_url: 'https://gitlab.com/bastien.terrier/test_webhook.git',
        },
        last_commit: {
          id: 'a3b2abdc7815a4cfa8998e2b91aa74ff1736ce97',
          message: 'Update README.md',
          timestamp: '2019-03-14T08:27:14Z',
          url:
            'https://gitlab.com/bastien.terrier/test_webhook/commit/a3b2abdc7815a4cfa8998e2b91aa74ff1736ce97',
          author: {
            name: 'Bastien Terrier',
            email: 'bastien.terrier@gmail.com',
          },
        },
        work_in_progress: true,
        total_time_spent: 0,
        human_total_time_spent: null,
        human_time_estimate: null,
      },
    };
    it('isGitlabPRCommentEvent should equal "true"', () => {
      expect(utils.isGitlabPRCommentEvent(gitlabPRCommentEvent)).toBe(true);
    });
    it('isGitlabPRCommentEvent should equal "false"', () => {
      expect(utils.isGitlabPRCommentEvent(githubPRCommentEvent)).toBe(false);
    });
    it('isGithubPRCommentEvent should equal "true"', () => {
      expect(utils.isGithubPRCommentEvent(githubPRCommentEvent)).toBe(true);
    });
    it('isGithubPRCommentEvent should equal "false"', () => {
      expect(utils.isGithubPRCommentEvent(gitlabPRCommentEvent)).toBe(false);
    });
    it('should create a Webhook object according to the Gitlab PR Comment Hook', () => {
      webhook = new Webhook(gitlabService, githubService);
      webhook.gitToWebhook(gitlabPRCommentEvent);

      expect(webhook.gitType).toBe(GitTypeEnum.Gitlab);
      expect(webhook.gitEvent).toBe(GitEventEnum.NewPRComment);
      expect(webhook.projectId).toBe(10607595);
      expect(webhook.gitService).toBe(gitlabService);
      expect(webhook.comment.id).toBe(156037494);
      expect(webhook.comment.description).toBe('test comment on MR');
      expect(webhook.pullRequest.description).toBe('');
      expect(webhook.pullRequest.title).toBe('WIP: Feature/tdd');
      expect(webhook.pullRequest.number).toBe(25);
      expect(webhook.repository.cloneURL).toBe(
        'https://gitlab.com/bastien.terrier/test_webhook',
      );
      expect(webhook.user.login).toBe('bastien.terrier');
    });

    it('should create a Webhook object according to the Github PR Comment Hook', () => {
      webhook = new Webhook(gitlabService, githubService);
      webhook.gitToWebhook(githubPRCommentEvent);

      expect(webhook.gitType).toBe(GitTypeEnum.Github);
      expect(webhook.gitEvent).toBe(GitEventEnum.NewPRComment);
      expect(webhook.gitService).toBe(githubService);
      expect(webhook.comment.id).toBe(478555715);
      expect(webhook.comment.description).toBe('test comment on PR');
      expect(webhook.pullRequest.description).toBe('');
      expect(webhook.pullRequest.title).toBe('ezfrthr');
      expect(webhook.pullRequest.number).toBe(93);
      expect(webhook.repository.fullName).toBe('bastienterrier/test-webhook');
      expect(webhook.repository.cloneURL).toBe(
        'https://github.com/bastienterrier/test-webhook',
      );
      expect(webhook.user.login).toBe('bastienterrier');
    });
  });

  describe('isClosedPREvent', () => {
    const githubClosedPREvent = {
      action: 'closed',
      number: 129,
      pull_request: {
        url:
          'https://api.github.com/repos/bastienterrier/test-webhook/pulls/129',
        id: 269462455,
        node_id: 'MDExOlB1bGxSZXF1ZXN0MjY5NDYyNDU1',
        html_url: 'https://github.com/bastienterrier/test-webhook/pull/129',
        diff_url:
          'https://github.com/bastienterrier/test-webhook/pull/129.diff',
        patch_url:
          'https://github.com/bastienterrier/test-webhook/pull/129.patch',
        issue_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/issues/129',
        number: 129,
        state: 'closed',
        locked: false,
        title: 'Update README.md',
        user: {
          login: 'bastienterrier',
          id: 25296454,
          node_id: 'MDQ6VXNlcjI1Mjk2NDU0',
          avatar_url: 'https://avatars0.githubusercontent.com/u/25296454?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/bastienterrier',
          html_url: 'https://github.com/bastienterrier',
          followers_url:
            'https://api.github.com/users/bastienterrier/followers',
          following_url:
            'https://api.github.com/users/bastienterrier/following{/other_user}',
          gists_url:
            'https://api.github.com/users/bastienterrier/gists{/gist_id}',
          starred_url:
            'https://api.github.com/users/bastienterrier/starred{/owner}{/repo}',
          subscriptions_url:
            'https://api.github.com/users/bastienterrier/subscriptions',
          organizations_url: 'https://api.github.com/users/bastienterrier/orgs',
          repos_url: 'https://api.github.com/users/bastienterrier/repos',
          events_url:
            'https://api.github.com/users/bastienterrier/events{/privacy}',
          received_events_url:
            'https://api.github.com/users/bastienterrier/received_events',
          type: 'User',
          site_admin: false,
        },
        body: '',
        created_at: '2019-04-11T08:01:50Z',
        updated_at: '2019-04-11T08:02:03Z',
        closed_at: '2019-04-11T08:02:03Z',
        merged_at: null,
        merge_commit_sha: '0753861c64bc713b18ecca6c44ca4eda0288cc8b',
        assignee: null,
        assignees: [],
        requested_reviewers: [],
        requested_teams: [],
        labels: [],
        milestone: null,
        commits_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/pulls/129/commits',
        review_comments_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/pulls/129/comments',
        review_comment_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/pulls/comments{/number}',
        comments_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/issues/129/comments',
        statuses_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/statuses/796d35504c393c3c019297b974d109eebee4c873',
        head: {
          label: 'bastienterrier:testingPR',
          ref: 'testingPR',
          sha: '796d35504c393c3c019297b974d109eebee4c873',
          user: {
            login: 'bastienterrier',
            id: 25296454,
            node_id: 'MDQ6VXNlcjI1Mjk2NDU0',
            avatar_url: 'https://avatars0.githubusercontent.com/u/25296454?v=4',
            gravatar_id: '',
            url: 'https://api.github.com/users/bastienterrier',
            html_url: 'https://github.com/bastienterrier',
            followers_url:
              'https://api.github.com/users/bastienterrier/followers',
            following_url:
              'https://api.github.com/users/bastienterrier/following{/other_user}',
            gists_url:
              'https://api.github.com/users/bastienterrier/gists{/gist_id}',
            starred_url:
              'https://api.github.com/users/bastienterrier/starred{/owner}{/repo}',
            subscriptions_url:
              'https://api.github.com/users/bastienterrier/subscriptions',
            organizations_url:
              'https://api.github.com/users/bastienterrier/orgs',
            repos_url: 'https://api.github.com/users/bastienterrier/repos',
            events_url:
              'https://api.github.com/users/bastienterrier/events{/privacy}',
            received_events_url:
              'https://api.github.com/users/bastienterrier/received_events',
            type: 'User',
            site_admin: false,
          },
          repo: {
            id: 169373600,
            node_id: 'MDEwOlJlcG9zaXRvcnkxNjkzNzM2MDA=',
            name: 'test-webhook',
            full_name: 'bastienterrier/test-webhook',
            private: false,
            owner: {
              login: 'bastienterrier',
              id: 25296454,
              node_id: 'MDQ6VXNlcjI1Mjk2NDU0',
              avatar_url:
                'https://avatars0.githubusercontent.com/u/25296454?v=4',
              gravatar_id: '',
              url: 'https://api.github.com/users/bastienterrier',
              html_url: 'https://github.com/bastienterrier',
              followers_url:
                'https://api.github.com/users/bastienterrier/followers',
              following_url:
                'https://api.github.com/users/bastienterrier/following{/other_user}',
              gists_url:
                'https://api.github.com/users/bastienterrier/gists{/gist_id}',
              starred_url:
                'https://api.github.com/users/bastienterrier/starred{/owner}{/repo}',
              subscriptions_url:
                'https://api.github.com/users/bastienterrier/subscriptions',
              organizations_url:
                'https://api.github.com/users/bastienterrier/orgs',
              repos_url: 'https://api.github.com/users/bastienterrier/repos',
              events_url:
                'https://api.github.com/users/bastienterrier/events{/privacy}',
              received_events_url:
                'https://api.github.com/users/bastienterrier/received_events',
              type: 'User',
              site_admin: false,
            },
            html_url: 'https://github.com/bastienterrier/test-webhook',
            description: null,
            fork: false,
            url: 'https://api.github.com/repos/bastienterrier/test-webhook',
            forks_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/forks',
            keys_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/keys{/key_id}',
            collaborators_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/collaborators{/collaborator}',
            teams_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/teams',
            hooks_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/hooks',
            issue_events_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/issues/events{/number}',
            events_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/events',
            assignees_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/assignees{/user}',
            branches_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/branches{/branch}',
            tags_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/tags',
            blobs_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/git/blobs{/sha}',
            git_tags_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/git/tags{/sha}',
            git_refs_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/git/refs{/sha}',
            trees_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/git/trees{/sha}',
            statuses_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/statuses/{sha}',
            languages_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/languages',
            stargazers_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/stargazers',
            contributors_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/contributors',
            subscribers_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/subscribers',
            subscription_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/subscription',
            commits_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/commits{/sha}',
            git_commits_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/git/commits{/sha}',
            comments_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/comments{/number}',
            issue_comment_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/issues/comments{/number}',
            contents_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/contents/{+path}',
            compare_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/compare/{base}...{head}',
            merges_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/merges',
            archive_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/{archive_format}{/ref}',
            downloads_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/downloads',
            issues_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/issues{/number}',
            pulls_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/pulls{/number}',
            milestones_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/milestones{/number}',
            notifications_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/notifications{?since,all,participating}',
            labels_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/labels{/name}',
            releases_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/releases{/id}',
            deployments_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/deployments',
            created_at: '2019-02-06T08:14:08Z',
            updated_at: '2019-04-11T07:45:07Z',
            pushed_at: '2019-04-11T08:01:51Z',
            git_url: 'git://github.com/bastienterrier/test-webhook.git',
            ssh_url: 'git@github.com:bastienterrier/test-webhook.git',
            clone_url: 'https://github.com/bastienterrier/test-webhook.git',
            svn_url: 'https://github.com/bastienterrier/test-webhook',
            homepage: null,
            size: 25501,
            stargazers_count: 0,
            watchers_count: 0,
            language: 'JavaScript',
            has_issues: true,
            has_projects: true,
            has_downloads: true,
            has_wiki: true,
            has_pages: false,
            forks_count: 0,
            mirror_url: null,
            archived: false,
            disabled: false,
            open_issues_count: 33,
            license: null,
            forks: 0,
            open_issues: 33,
            watchers: 0,
            default_branch: 'master',
          },
        },
        base: {
          label: 'bastienterrier:master',
          ref: 'master',
          sha: '500872c32c9cfe955576000fc01bae1a0d411ef3',
          user: {
            login: 'bastienterrier',
            id: 25296454,
            node_id: 'MDQ6VXNlcjI1Mjk2NDU0',
            avatar_url: 'https://avatars0.githubusercontent.com/u/25296454?v=4',
            gravatar_id: '',
            url: 'https://api.github.com/users/bastienterrier',
            html_url: 'https://github.com/bastienterrier',
            followers_url:
              'https://api.github.com/users/bastienterrier/followers',
            following_url:
              'https://api.github.com/users/bastienterrier/following{/other_user}',
            gists_url:
              'https://api.github.com/users/bastienterrier/gists{/gist_id}',
            starred_url:
              'https://api.github.com/users/bastienterrier/starred{/owner}{/repo}',
            subscriptions_url:
              'https://api.github.com/users/bastienterrier/subscriptions',
            organizations_url:
              'https://api.github.com/users/bastienterrier/orgs',
            repos_url: 'https://api.github.com/users/bastienterrier/repos',
            events_url:
              'https://api.github.com/users/bastienterrier/events{/privacy}',
            received_events_url:
              'https://api.github.com/users/bastienterrier/received_events',
            type: 'User',
            site_admin: false,
          },
          repo: {
            id: 169373600,
            node_id: 'MDEwOlJlcG9zaXRvcnkxNjkzNzM2MDA=',
            name: 'test-webhook',
            full_name: 'bastienterrier/test-webhook',
            private: false,
            owner: {
              login: 'bastienterrier',
              id: 25296454,
              node_id: 'MDQ6VXNlcjI1Mjk2NDU0',
              avatar_url:
                'https://avatars0.githubusercontent.com/u/25296454?v=4',
              gravatar_id: '',
              url: 'https://api.github.com/users/bastienterrier',
              html_url: 'https://github.com/bastienterrier',
              followers_url:
                'https://api.github.com/users/bastienterrier/followers',
              following_url:
                'https://api.github.com/users/bastienterrier/following{/other_user}',
              gists_url:
                'https://api.github.com/users/bastienterrier/gists{/gist_id}',
              starred_url:
                'https://api.github.com/users/bastienterrier/starred{/owner}{/repo}',
              subscriptions_url:
                'https://api.github.com/users/bastienterrier/subscriptions',
              organizations_url:
                'https://api.github.com/users/bastienterrier/orgs',
              repos_url: 'https://api.github.com/users/bastienterrier/repos',
              events_url:
                'https://api.github.com/users/bastienterrier/events{/privacy}',
              received_events_url:
                'https://api.github.com/users/bastienterrier/received_events',
              type: 'User',
              site_admin: false,
            },
            html_url: 'https://github.com/bastienterrier/test-webhook',
            description: null,
            fork: false,
            url: 'https://api.github.com/repos/bastienterrier/test-webhook',
            forks_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/forks',
            keys_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/keys{/key_id}',
            collaborators_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/collaborators{/collaborator}',
            teams_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/teams',
            hooks_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/hooks',
            issue_events_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/issues/events{/number}',
            events_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/events',
            assignees_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/assignees{/user}',
            branches_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/branches{/branch}',
            tags_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/tags',
            blobs_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/git/blobs{/sha}',
            git_tags_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/git/tags{/sha}',
            git_refs_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/git/refs{/sha}',
            trees_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/git/trees{/sha}',
            statuses_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/statuses/{sha}',
            languages_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/languages',
            stargazers_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/stargazers',
            contributors_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/contributors',
            subscribers_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/subscribers',
            subscription_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/subscription',
            commits_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/commits{/sha}',
            git_commits_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/git/commits{/sha}',
            comments_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/comments{/number}',
            issue_comment_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/issues/comments{/number}',
            contents_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/contents/{+path}',
            compare_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/compare/{base}...{head}',
            merges_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/merges',
            archive_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/{archive_format}{/ref}',
            downloads_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/downloads',
            issues_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/issues{/number}',
            pulls_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/pulls{/number}',
            milestones_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/milestones{/number}',
            notifications_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/notifications{?since,all,participating}',
            labels_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/labels{/name}',
            releases_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/releases{/id}',
            deployments_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/deployments',
            created_at: '2019-02-06T08:14:08Z',
            updated_at: '2019-04-11T07:45:07Z',
            pushed_at: '2019-04-11T08:01:51Z',
            git_url: 'git://github.com/bastienterrier/test-webhook.git',
            ssh_url: 'git@github.com:bastienterrier/test-webhook.git',
            clone_url: 'https://github.com/bastienterrier/test-webhook.git',
            svn_url: 'https://github.com/bastienterrier/test-webhook',
            homepage: null,
            size: 25501,
            stargazers_count: 0,
            watchers_count: 0,
            language: 'JavaScript',
            has_issues: true,
            has_projects: true,
            has_downloads: true,
            has_wiki: true,
            has_pages: false,
            forks_count: 0,
            mirror_url: null,
            archived: false,
            disabled: false,
            open_issues_count: 33,
            license: null,
            forks: 0,
            open_issues: 33,
            watchers: 0,
            default_branch: 'master',
          },
        },
        _links: {
          self: {
            href:
              'https://api.github.com/repos/bastienterrier/test-webhook/pulls/129',
          },
          html: {
            href: 'https://github.com/bastienterrier/test-webhook/pull/129',
          },
          issue: {
            href:
              'https://api.github.com/repos/bastienterrier/test-webhook/issues/129',
          },
          comments: {
            href:
              'https://api.github.com/repos/bastienterrier/test-webhook/issues/129/comments',
          },
          review_comments: {
            href:
              'https://api.github.com/repos/bastienterrier/test-webhook/pulls/129/comments',
          },
          review_comment: {
            href:
              'https://api.github.com/repos/bastienterrier/test-webhook/pulls/comments{/number}',
          },
          commits: {
            href:
              'https://api.github.com/repos/bastienterrier/test-webhook/pulls/129/commits',
          },
          statuses: {
            href:
              'https://api.github.com/repos/bastienterrier/test-webhook/statuses/796d35504c393c3c019297b974d109eebee4c873',
          },
        },
        author_association: 'OWNER',
        draft: false,
        merged: false,
        mergeable: true,
        rebaseable: true,
        mergeable_state: 'clean',
        merged_by: null,
        comments: 0,
        review_comments: 0,
        maintainer_can_modify: false,
        commits: 1,
        additions: 1,
        deletions: 0,
        changed_files: 1,
      },
      repository: {
        id: 169373600,
        node_id: 'MDEwOlJlcG9zaXRvcnkxNjkzNzM2MDA=',
        name: 'test-webhook',
        full_name: 'bastienterrier/test-webhook',
        private: false,
        owner: {
          login: 'bastienterrier',
          id: 25296454,
          node_id: 'MDQ6VXNlcjI1Mjk2NDU0',
          avatar_url: 'https://avatars0.githubusercontent.com/u/25296454?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/bastienterrier',
          html_url: 'https://github.com/bastienterrier',
          followers_url:
            'https://api.github.com/users/bastienterrier/followers',
          following_url:
            'https://api.github.com/users/bastienterrier/following{/other_user}',
          gists_url:
            'https://api.github.com/users/bastienterrier/gists{/gist_id}',
          starred_url:
            'https://api.github.com/users/bastienterrier/starred{/owner}{/repo}',
          subscriptions_url:
            'https://api.github.com/users/bastienterrier/subscriptions',
          organizations_url: 'https://api.github.com/users/bastienterrier/orgs',
          repos_url: 'https://api.github.com/users/bastienterrier/repos',
          events_url:
            'https://api.github.com/users/bastienterrier/events{/privacy}',
          received_events_url:
            'https://api.github.com/users/bastienterrier/received_events',
          type: 'User',
          site_admin: false,
        },
        html_url: 'https://github.com/bastienterrier/test-webhook',
        description: null,
        fork: false,
        url: 'https://api.github.com/repos/bastienterrier/test-webhook',
        forks_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/forks',
        keys_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/keys{/key_id}',
        collaborators_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/collaborators{/collaborator}',
        teams_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/teams',
        hooks_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/hooks',
        issue_events_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/issues/events{/number}',
        events_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/events',
        assignees_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/assignees{/user}',
        branches_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/branches{/branch}',
        tags_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/tags',
        blobs_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/git/blobs{/sha}',
        git_tags_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/git/tags{/sha}',
        git_refs_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/git/refs{/sha}',
        trees_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/git/trees{/sha}',
        statuses_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/statuses/{sha}',
        languages_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/languages',
        stargazers_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/stargazers',
        contributors_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/contributors',
        subscribers_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/subscribers',
        subscription_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/subscription',
        commits_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/commits{/sha}',
        git_commits_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/git/commits{/sha}',
        comments_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/comments{/number}',
        issue_comment_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/issues/comments{/number}',
        contents_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/contents/{+path}',
        compare_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/compare/{base}...{head}',
        merges_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/merges',
        archive_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/{archive_format}{/ref}',
        downloads_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/downloads',
        issues_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/issues{/number}',
        pulls_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/pulls{/number}',
        milestones_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/milestones{/number}',
        notifications_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/notifications{?since,all,participating}',
        labels_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/labels{/name}',
        releases_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/releases{/id}',
        deployments_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/deployments',
        created_at: '2019-02-06T08:14:08Z',
        updated_at: '2019-04-11T07:45:07Z',
        pushed_at: '2019-04-11T08:01:51Z',
        git_url: 'git://github.com/bastienterrier/test-webhook.git',
        ssh_url: 'git@github.com:bastienterrier/test-webhook.git',
        clone_url: 'https://github.com/bastienterrier/test-webhook.git',
        svn_url: 'https://github.com/bastienterrier/test-webhook',
        homepage: null,
        size: 25501,
        stargazers_count: 0,
        watchers_count: 0,
        language: 'JavaScript',
        has_issues: true,
        has_projects: true,
        has_downloads: true,
        has_wiki: true,
        has_pages: false,
        forks_count: 0,
        mirror_url: null,
        archived: false,
        disabled: false,
        open_issues_count: 33,
        license: null,
        forks: 0,
        open_issues: 33,
        watchers: 0,
        default_branch: 'master',
      },
      sender: {
        login: 'bastienterrier',
        id: 25296454,
        node_id: 'MDQ6VXNlcjI1Mjk2NDU0',
        avatar_url: 'https://avatars0.githubusercontent.com/u/25296454?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/bastienterrier',
        html_url: 'https://github.com/bastienterrier',
        followers_url: 'https://api.github.com/users/bastienterrier/followers',
        following_url:
          'https://api.github.com/users/bastienterrier/following{/other_user}',
        gists_url:
          'https://api.github.com/users/bastienterrier/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/bastienterrier/starred{/owner}{/repo}',
        subscriptions_url:
          'https://api.github.com/users/bastienterrier/subscriptions',
        organizations_url: 'https://api.github.com/users/bastienterrier/orgs',
        repos_url: 'https://api.github.com/users/bastienterrier/repos',
        events_url:
          'https://api.github.com/users/bastienterrier/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/bastienterrier/received_events',
        type: 'User',
        site_admin: false,
      },
    };
    const gitlabClosedPREvent = {
      object_kind: 'merge_request',
      event_type: 'merge_request',
      user: {
        name: 'Bastien Terrier',
        username: 'bastien.terrier',
        avatar_url:
          'https://secure.gravatar.com/avatar/a17bda7df8612108bc4442ce57cc6dc3?s=80&d=identicon',
      },
      project: {
        id: 10607595,
        name: 'test_webhook',
        description: '',
        web_url: 'https://gitlab.com/bastien.terrier/test_webhook',
        avatar_url: null,
        git_ssh_url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
        git_http_url: 'https://gitlab.com/bastien.terrier/test_webhook.git',
        namespace: 'bastien.terrier',
        visibility_level: 20,
        path_with_namespace: 'bastien.terrier/test_webhook',
        default_branch: 'master',
        ci_config_path: null,
        homepage: 'https://gitlab.com/bastien.terrier/test_webhook',
        url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
        ssh_url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
        http_url: 'https://gitlab.com/bastien.terrier/test_webhook.git',
      },
      object_attributes: {
        assignee_id: null,
        author_id: 3360534,
        created_at: '2019-04-09 13:14:44 UTC',
        description: '',
        head_pipeline_id: 55243238,
        id: 27349057,
        iid: 35,
        last_edited_at: null,
        last_edited_by_id: null,
        merge_commit_sha: null,
        merge_error: null,
        merge_params: {
          force_remove_source_branch: '0',
        },
        merge_status: 'cannot_be_merged',
        merge_user_id: null,
        merge_when_pipeline_succeeds: false,
        milestone_id: null,
        source_branch: 'feature/close',
        source_project_id: 10607595,
        state: 'closed',
        target_branch: 'master',
        target_project_id: 10607595,
        time_estimate: 0,
        title: 'bad title...',
        updated_at: '2019-04-11 08:04:10 UTC',
        updated_by_id: null,
        url:
          'https://gitlab.com/bastien.terrier/test_webhook/merge_requests/35',
        source: {
          id: 10607595,
          name: 'test_webhook',
          description: '',
          web_url: 'https://gitlab.com/bastien.terrier/test_webhook',
          avatar_url: null,
          git_ssh_url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
          git_http_url: 'https://gitlab.com/bastien.terrier/test_webhook.git',
          namespace: 'bastien.terrier',
          visibility_level: 20,
          path_with_namespace: 'bastien.terrier/test_webhook',
          default_branch: 'master',
          ci_config_path: null,
          homepage: 'https://gitlab.com/bastien.terrier/test_webhook',
          url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
          ssh_url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
          http_url: 'https://gitlab.com/bastien.terrier/test_webhook.git',
        },
        target: {
          id: 10607595,
          name: 'test_webhook',
          description: '',
          web_url: 'https://gitlab.com/bastien.terrier/test_webhook',
          avatar_url: null,
          git_ssh_url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
          git_http_url: 'https://gitlab.com/bastien.terrier/test_webhook.git',
          namespace: 'bastien.terrier',
          visibility_level: 20,
          path_with_namespace: 'bastien.terrier/test_webhook',
          default_branch: 'master',
          ci_config_path: null,
          homepage: 'https://gitlab.com/bastien.terrier/test_webhook',
          url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
          ssh_url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
          http_url: 'https://gitlab.com/bastien.terrier/test_webhook.git',
        },
        last_commit: {
          id: '7f1f75e0fe821b814eba23277b5f0b736737ebd0',
          message: 'Add new file',
          timestamp: '2019-04-11T07:56:31Z',
          url:
            'https://gitlab.com/bastien.terrier/test_webhook/commit/7f1f75e0fe821b814eba23277b5f0b736737ebd0',
          author: {
            name: 'Bastien Terrier',
            email: 'bastien.terrier@gmail.com',
          },
        },
        work_in_progress: false,
        total_time_spent: 0,
        human_total_time_spent: null,
        human_time_estimate: null,
        action: 'close',
      },
      labels: [],
      changes: {
        state: {
          previous: 'opened',
          current: 'closed',
        },
        updated_at: {
          previous: '2019-04-11 08:03:11 UTC',
          current: '2019-04-11 08:04:10 UTC',
        },
        total_time_spent: {
          previous: null,
          current: 0,
        },
      },
      repository: {
        name: 'test_webhook',
        url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
        description: '',
        homepage: 'https://gitlab.com/bastien.terrier/test_webhook',
      },
    };
    it('isGitlabClosedPREvent should equal "true"', () => {
      expect(utils.isGitlabClosedPREvent(gitlabClosedPREvent)).toBe(true);
    });
    it('isGitlabClosedPREvent should equal "false"', () => {
      expect(utils.isGitlabClosedPREvent(githubClosedPREvent)).toBe(false);
    });
    it('isGithubClosedPREvent should equal "true"', () => {
      expect(utils.isGithubClosedPREvent(githubClosedPREvent)).toBe(true);
    });
    it('isGithubClosedPREvent should equal "false"', () => {
      expect(utils.isGithubClosedPREvent(gitlabClosedPREvent)).toBe(false);
    });
    it('should create a Webhook object according to the Gitlab PR Closed Hook', () => {
      webhook = new Webhook(gitlabService, githubService);
      webhook.gitToWebhook(gitlabClosedPREvent);

      expect(webhook.gitType).toBe(GitTypeEnum.Gitlab);
      expect(webhook.gitEvent).toBe(GitEventEnum.ClosedPR);
      expect(webhook.projectId).toBe(10607595);
      expect(webhook.gitService).toBe(gitlabService);
      expect(webhook.pullRequest.number).toBe(35);
      expect(webhook.pullRequest.title).toBe('bad title...');
      expect(webhook.pullRequest.description).toBe('');
      expect(webhook.pullRequest.sourceBranch).toBe('feature/close');
      expect(webhook.pullRequest.targetBranch).toBe('master');
      expect(webhook.repository.cloneURL).toBe(
        'https://gitlab.com/bastien.terrier/test_webhook',
      );
      expect(webhook.user.login).toBe('bastien.terrier');
      expect(webhook.pullRequest.user.login).toBe('bastien.terrier');
    });

    it('should create a Webhook object according to the Github PR Closed Hook', () => {
      webhook = new Webhook(gitlabService, githubService);
      webhook.gitToWebhook(githubClosedPREvent);

      expect(webhook.gitType).toBe(GitTypeEnum.Github);
      expect(webhook.gitEvent).toBe(GitEventEnum.ClosedPR);
      expect(webhook.gitService).toBe(githubService);
      expect(webhook.pullRequest.number).toBe(129);
      expect(webhook.pullRequest.title).toBe('Update README.md');
      expect(webhook.pullRequest.description).toBe('');
      expect(webhook.pullRequest.sourceBranch).toBe('testingPR');
      expect(webhook.pullRequest.targetBranch).toBe('master');
      expect(webhook.repository.fullName).toBe('bastienterrier/test-webhook');
      expect(webhook.repository.cloneURL).toBe(
        'https://github.com/bastienterrier/test-webhook',
      );
      expect(webhook.user.login).toBe('bastienterrier');
      expect(webhook.pullRequest.user.login).toBe('bastienterrier');
    });
  });

  describe('isReopenedPREvent', () => {
    const githubReopenedPREvent = {
      action: 'reopened',
      number: 129,
      pull_request: {
        url:
          'https://api.github.com/repos/bastienterrier/test-webhook/pulls/129',
        id: 269462455,
        node_id: 'MDExOlB1bGxSZXF1ZXN0MjY5NDYyNDU1',
        html_url: 'https://github.com/bastienterrier/test-webhook/pull/129',
        diff_url:
          'https://github.com/bastienterrier/test-webhook/pull/129.diff',
        patch_url:
          'https://github.com/bastienterrier/test-webhook/pull/129.patch',
        issue_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/issues/129',
        number: 129,
        state: 'open',
        locked: false,
        title: 'Update README.md',
        user: {
          login: 'bastienterrier',
          id: 25296454,
          node_id: 'MDQ6VXNlcjI1Mjk2NDU0',
          avatar_url: 'https://avatars0.githubusercontent.com/u/25296454?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/bastienterrier',
          html_url: 'https://github.com/bastienterrier',
          followers_url:
            'https://api.github.com/users/bastienterrier/followers',
          following_url:
            'https://api.github.com/users/bastienterrier/following{/other_user}',
          gists_url:
            'https://api.github.com/users/bastienterrier/gists{/gist_id}',
          starred_url:
            'https://api.github.com/users/bastienterrier/starred{/owner}{/repo}',
          subscriptions_url:
            'https://api.github.com/users/bastienterrier/subscriptions',
          organizations_url: 'https://api.github.com/users/bastienterrier/orgs',
          repos_url: 'https://api.github.com/users/bastienterrier/repos',
          events_url:
            'https://api.github.com/users/bastienterrier/events{/privacy}',
          received_events_url:
            'https://api.github.com/users/bastienterrier/received_events',
          type: 'User',
          site_admin: false,
        },
        body: '',
        created_at: '2019-04-11T08:01:50Z',
        updated_at: '2019-04-11T08:04:55Z',
        closed_at: null,
        merged_at: null,
        merge_commit_sha: '0753861c64bc713b18ecca6c44ca4eda0288cc8b',
        assignee: null,
        assignees: [],
        requested_reviewers: [],
        requested_teams: [],
        labels: [],
        milestone: null,
        commits_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/pulls/129/commits',
        review_comments_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/pulls/129/comments',
        review_comment_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/pulls/comments{/number}',
        comments_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/issues/129/comments',
        statuses_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/statuses/796d35504c393c3c019297b974d109eebee4c873',
        head: {
          label: 'bastienterrier:testingPR',
          ref: 'testingPR',
          sha: '796d35504c393c3c019297b974d109eebee4c873',
          user: {
            login: 'bastienterrier',
            id: 25296454,
            node_id: 'MDQ6VXNlcjI1Mjk2NDU0',
            avatar_url: 'https://avatars0.githubusercontent.com/u/25296454?v=4',
            gravatar_id: '',
            url: 'https://api.github.com/users/bastienterrier',
            html_url: 'https://github.com/bastienterrier',
            followers_url:
              'https://api.github.com/users/bastienterrier/followers',
            following_url:
              'https://api.github.com/users/bastienterrier/following{/other_user}',
            gists_url:
              'https://api.github.com/users/bastienterrier/gists{/gist_id}',
            starred_url:
              'https://api.github.com/users/bastienterrier/starred{/owner}{/repo}',
            subscriptions_url:
              'https://api.github.com/users/bastienterrier/subscriptions',
            organizations_url:
              'https://api.github.com/users/bastienterrier/orgs',
            repos_url: 'https://api.github.com/users/bastienterrier/repos',
            events_url:
              'https://api.github.com/users/bastienterrier/events{/privacy}',
            received_events_url:
              'https://api.github.com/users/bastienterrier/received_events',
            type: 'User',
            site_admin: false,
          },
          repo: {
            id: 169373600,
            node_id: 'MDEwOlJlcG9zaXRvcnkxNjkzNzM2MDA=',
            name: 'test-webhook',
            full_name: 'bastienterrier/test-webhook',
            private: false,
            owner: {
              login: 'bastienterrier',
              id: 25296454,
              node_id: 'MDQ6VXNlcjI1Mjk2NDU0',
              avatar_url:
                'https://avatars0.githubusercontent.com/u/25296454?v=4',
              gravatar_id: '',
              url: 'https://api.github.com/users/bastienterrier',
              html_url: 'https://github.com/bastienterrier',
              followers_url:
                'https://api.github.com/users/bastienterrier/followers',
              following_url:
                'https://api.github.com/users/bastienterrier/following{/other_user}',
              gists_url:
                'https://api.github.com/users/bastienterrier/gists{/gist_id}',
              starred_url:
                'https://api.github.com/users/bastienterrier/starred{/owner}{/repo}',
              subscriptions_url:
                'https://api.github.com/users/bastienterrier/subscriptions',
              organizations_url:
                'https://api.github.com/users/bastienterrier/orgs',
              repos_url: 'https://api.github.com/users/bastienterrier/repos',
              events_url:
                'https://api.github.com/users/bastienterrier/events{/privacy}',
              received_events_url:
                'https://api.github.com/users/bastienterrier/received_events',
              type: 'User',
              site_admin: false,
            },
            html_url: 'https://github.com/bastienterrier/test-webhook',
            description: null,
            fork: false,
            url: 'https://api.github.com/repos/bastienterrier/test-webhook',
            forks_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/forks',
            keys_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/keys{/key_id}',
            collaborators_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/collaborators{/collaborator}',
            teams_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/teams',
            hooks_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/hooks',
            issue_events_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/issues/events{/number}',
            events_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/events',
            assignees_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/assignees{/user}',
            branches_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/branches{/branch}',
            tags_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/tags',
            blobs_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/git/blobs{/sha}',
            git_tags_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/git/tags{/sha}',
            git_refs_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/git/refs{/sha}',
            trees_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/git/trees{/sha}',
            statuses_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/statuses/{sha}',
            languages_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/languages',
            stargazers_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/stargazers',
            contributors_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/contributors',
            subscribers_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/subscribers',
            subscription_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/subscription',
            commits_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/commits{/sha}',
            git_commits_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/git/commits{/sha}',
            comments_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/comments{/number}',
            issue_comment_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/issues/comments{/number}',
            contents_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/contents/{+path}',
            compare_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/compare/{base}...{head}',
            merges_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/merges',
            archive_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/{archive_format}{/ref}',
            downloads_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/downloads',
            issues_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/issues{/number}',
            pulls_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/pulls{/number}',
            milestones_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/milestones{/number}',
            notifications_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/notifications{?since,all,participating}',
            labels_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/labels{/name}',
            releases_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/releases{/id}',
            deployments_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/deployments',
            created_at: '2019-02-06T08:14:08Z',
            updated_at: '2019-04-11T07:45:07Z',
            pushed_at: '2019-04-11T08:01:51Z',
            git_url: 'git://github.com/bastienterrier/test-webhook.git',
            ssh_url: 'git@github.com:bastienterrier/test-webhook.git',
            clone_url: 'https://github.com/bastienterrier/test-webhook.git',
            svn_url: 'https://github.com/bastienterrier/test-webhook',
            homepage: null,
            size: 25501,
            stargazers_count: 0,
            watchers_count: 0,
            language: 'JavaScript',
            has_issues: true,
            has_projects: true,
            has_downloads: true,
            has_wiki: true,
            has_pages: false,
            forks_count: 0,
            mirror_url: null,
            archived: false,
            disabled: false,
            open_issues_count: 34,
            license: null,
            forks: 0,
            open_issues: 34,
            watchers: 0,
            default_branch: 'master',
          },
        },
        base: {
          label: 'bastienterrier:master',
          ref: 'master',
          sha: '500872c32c9cfe955576000fc01bae1a0d411ef3',
          user: {
            login: 'bastienterrier',
            id: 25296454,
            node_id: 'MDQ6VXNlcjI1Mjk2NDU0',
            avatar_url: 'https://avatars0.githubusercontent.com/u/25296454?v=4',
            gravatar_id: '',
            url: 'https://api.github.com/users/bastienterrier',
            html_url: 'https://github.com/bastienterrier',
            followers_url:
              'https://api.github.com/users/bastienterrier/followers',
            following_url:
              'https://api.github.com/users/bastienterrier/following{/other_user}',
            gists_url:
              'https://api.github.com/users/bastienterrier/gists{/gist_id}',
            starred_url:
              'https://api.github.com/users/bastienterrier/starred{/owner}{/repo}',
            subscriptions_url:
              'https://api.github.com/users/bastienterrier/subscriptions',
            organizations_url:
              'https://api.github.com/users/bastienterrier/orgs',
            repos_url: 'https://api.github.com/users/bastienterrier/repos',
            events_url:
              'https://api.github.com/users/bastienterrier/events{/privacy}',
            received_events_url:
              'https://api.github.com/users/bastienterrier/received_events',
            type: 'User',
            site_admin: false,
          },
          repo: {
            id: 169373600,
            node_id: 'MDEwOlJlcG9zaXRvcnkxNjkzNzM2MDA=',
            name: 'test-webhook',
            full_name: 'bastienterrier/test-webhook',
            private: false,
            owner: {
              login: 'bastienterrier',
              id: 25296454,
              node_id: 'MDQ6VXNlcjI1Mjk2NDU0',
              avatar_url:
                'https://avatars0.githubusercontent.com/u/25296454?v=4',
              gravatar_id: '',
              url: 'https://api.github.com/users/bastienterrier',
              html_url: 'https://github.com/bastienterrier',
              followers_url:
                'https://api.github.com/users/bastienterrier/followers',
              following_url:
                'https://api.github.com/users/bastienterrier/following{/other_user}',
              gists_url:
                'https://api.github.com/users/bastienterrier/gists{/gist_id}',
              starred_url:
                'https://api.github.com/users/bastienterrier/starred{/owner}{/repo}',
              subscriptions_url:
                'https://api.github.com/users/bastienterrier/subscriptions',
              organizations_url:
                'https://api.github.com/users/bastienterrier/orgs',
              repos_url: 'https://api.github.com/users/bastienterrier/repos',
              events_url:
                'https://api.github.com/users/bastienterrier/events{/privacy}',
              received_events_url:
                'https://api.github.com/users/bastienterrier/received_events',
              type: 'User',
              site_admin: false,
            },
            html_url: 'https://github.com/bastienterrier/test-webhook',
            description: null,
            fork: false,
            url: 'https://api.github.com/repos/bastienterrier/test-webhook',
            forks_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/forks',
            keys_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/keys{/key_id}',
            collaborators_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/collaborators{/collaborator}',
            teams_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/teams',
            hooks_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/hooks',
            issue_events_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/issues/events{/number}',
            events_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/events',
            assignees_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/assignees{/user}',
            branches_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/branches{/branch}',
            tags_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/tags',
            blobs_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/git/blobs{/sha}',
            git_tags_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/git/tags{/sha}',
            git_refs_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/git/refs{/sha}',
            trees_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/git/trees{/sha}',
            statuses_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/statuses/{sha}',
            languages_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/languages',
            stargazers_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/stargazers',
            contributors_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/contributors',
            subscribers_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/subscribers',
            subscription_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/subscription',
            commits_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/commits{/sha}',
            git_commits_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/git/commits{/sha}',
            comments_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/comments{/number}',
            issue_comment_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/issues/comments{/number}',
            contents_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/contents/{+path}',
            compare_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/compare/{base}...{head}',
            merges_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/merges',
            archive_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/{archive_format}{/ref}',
            downloads_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/downloads',
            issues_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/issues{/number}',
            pulls_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/pulls{/number}',
            milestones_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/milestones{/number}',
            notifications_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/notifications{?since,all,participating}',
            labels_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/labels{/name}',
            releases_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/releases{/id}',
            deployments_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/deployments',
            created_at: '2019-02-06T08:14:08Z',
            updated_at: '2019-04-11T07:45:07Z',
            pushed_at: '2019-04-11T08:01:51Z',
            git_url: 'git://github.com/bastienterrier/test-webhook.git',
            ssh_url: 'git@github.com:bastienterrier/test-webhook.git',
            clone_url: 'https://github.com/bastienterrier/test-webhook.git',
            svn_url: 'https://github.com/bastienterrier/test-webhook',
            homepage: null,
            size: 25501,
            stargazers_count: 0,
            watchers_count: 0,
            language: 'JavaScript',
            has_issues: true,
            has_projects: true,
            has_downloads: true,
            has_wiki: true,
            has_pages: false,
            forks_count: 0,
            mirror_url: null,
            archived: false,
            disabled: false,
            open_issues_count: 34,
            license: null,
            forks: 0,
            open_issues: 34,
            watchers: 0,
            default_branch: 'master',
          },
        },
        _links: {
          self: {
            href:
              'https://api.github.com/repos/bastienterrier/test-webhook/pulls/129',
          },
          html: {
            href: 'https://github.com/bastienterrier/test-webhook/pull/129',
          },
          issue: {
            href:
              'https://api.github.com/repos/bastienterrier/test-webhook/issues/129',
          },
          comments: {
            href:
              'https://api.github.com/repos/bastienterrier/test-webhook/issues/129/comments',
          },
          review_comments: {
            href:
              'https://api.github.com/repos/bastienterrier/test-webhook/pulls/129/comments',
          },
          review_comment: {
            href:
              'https://api.github.com/repos/bastienterrier/test-webhook/pulls/comments{/number}',
          },
          commits: {
            href:
              'https://api.github.com/repos/bastienterrier/test-webhook/pulls/129/commits',
          },
          statuses: {
            href:
              'https://api.github.com/repos/bastienterrier/test-webhook/statuses/796d35504c393c3c019297b974d109eebee4c873',
          },
        },
        author_association: 'OWNER',
        draft: false,
        merged: false,
        mergeable: null,
        rebaseable: null,
        mergeable_state: 'unknown',
        merged_by: null,
        comments: 0,
        review_comments: 0,
        maintainer_can_modify: false,
        commits: 1,
        additions: 1,
        deletions: 0,
        changed_files: 1,
      },
      repository: {
        id: 169373600,
        node_id: 'MDEwOlJlcG9zaXRvcnkxNjkzNzM2MDA=',
        name: 'test-webhook',
        full_name: 'bastienterrier/test-webhook',
        private: false,
        owner: {
          login: 'bastienterrier',
          id: 25296454,
          node_id: 'MDQ6VXNlcjI1Mjk2NDU0',
          avatar_url: 'https://avatars0.githubusercontent.com/u/25296454?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/bastienterrier',
          html_url: 'https://github.com/bastienterrier',
          followers_url:
            'https://api.github.com/users/bastienterrier/followers',
          following_url:
            'https://api.github.com/users/bastienterrier/following{/other_user}',
          gists_url:
            'https://api.github.com/users/bastienterrier/gists{/gist_id}',
          starred_url:
            'https://api.github.com/users/bastienterrier/starred{/owner}{/repo}',
          subscriptions_url:
            'https://api.github.com/users/bastienterrier/subscriptions',
          organizations_url: 'https://api.github.com/users/bastienterrier/orgs',
          repos_url: 'https://api.github.com/users/bastienterrier/repos',
          events_url:
            'https://api.github.com/users/bastienterrier/events{/privacy}',
          received_events_url:
            'https://api.github.com/users/bastienterrier/received_events',
          type: 'User',
          site_admin: false,
        },
        html_url: 'https://github.com/bastienterrier/test-webhook',
        description: null,
        fork: false,
        url: 'https://api.github.com/repos/bastienterrier/test-webhook',
        forks_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/forks',
        keys_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/keys{/key_id}',
        collaborators_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/collaborators{/collaborator}',
        teams_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/teams',
        hooks_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/hooks',
        issue_events_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/issues/events{/number}',
        events_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/events',
        assignees_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/assignees{/user}',
        branches_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/branches{/branch}',
        tags_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/tags',
        blobs_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/git/blobs{/sha}',
        git_tags_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/git/tags{/sha}',
        git_refs_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/git/refs{/sha}',
        trees_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/git/trees{/sha}',
        statuses_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/statuses/{sha}',
        languages_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/languages',
        stargazers_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/stargazers',
        contributors_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/contributors',
        subscribers_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/subscribers',
        subscription_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/subscription',
        commits_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/commits{/sha}',
        git_commits_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/git/commits{/sha}',
        comments_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/comments{/number}',
        issue_comment_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/issues/comments{/number}',
        contents_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/contents/{+path}',
        compare_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/compare/{base}...{head}',
        merges_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/merges',
        archive_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/{archive_format}{/ref}',
        downloads_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/downloads',
        issues_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/issues{/number}',
        pulls_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/pulls{/number}',
        milestones_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/milestones{/number}',
        notifications_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/notifications{?since,all,participating}',
        labels_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/labels{/name}',
        releases_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/releases{/id}',
        deployments_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/deployments',
        created_at: '2019-02-06T08:14:08Z',
        updated_at: '2019-04-11T07:45:07Z',
        pushed_at: '2019-04-11T08:01:51Z',
        git_url: 'git://github.com/bastienterrier/test-webhook.git',
        ssh_url: 'git@github.com:bastienterrier/test-webhook.git',
        clone_url: 'https://github.com/bastienterrier/test-webhook.git',
        svn_url: 'https://github.com/bastienterrier/test-webhook',
        homepage: null,
        size: 25501,
        stargazers_count: 0,
        watchers_count: 0,
        language: 'JavaScript',
        has_issues: true,
        has_projects: true,
        has_downloads: true,
        has_wiki: true,
        has_pages: false,
        forks_count: 0,
        mirror_url: null,
        archived: false,
        disabled: false,
        open_issues_count: 34,
        license: null,
        forks: 0,
        open_issues: 34,
        watchers: 0,
        default_branch: 'master',
      },
      sender: {
        login: 'bastienterrier',
        id: 25296454,
        node_id: 'MDQ6VXNlcjI1Mjk2NDU0',
        avatar_url: 'https://avatars0.githubusercontent.com/u/25296454?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/bastienterrier',
        html_url: 'https://github.com/bastienterrier',
        followers_url: 'https://api.github.com/users/bastienterrier/followers',
        following_url:
          'https://api.github.com/users/bastienterrier/following{/other_user}',
        gists_url:
          'https://api.github.com/users/bastienterrier/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/bastienterrier/starred{/owner}{/repo}',
        subscriptions_url:
          'https://api.github.com/users/bastienterrier/subscriptions',
        organizations_url: 'https://api.github.com/users/bastienterrier/orgs',
        repos_url: 'https://api.github.com/users/bastienterrier/repos',
        events_url:
          'https://api.github.com/users/bastienterrier/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/bastienterrier/received_events',
        type: 'User',
        site_admin: false,
      },
    };
    const gitlabReopenedPREvent = {
      object_kind: 'merge_request',
      event_type: 'merge_request',
      user: {
        name: 'Bastien Terrier',
        username: 'bastien.terrier',
        avatar_url:
          'https://secure.gravatar.com/avatar/a17bda7df8612108bc4442ce57cc6dc3?s=80&d=identicon',
      },
      project: {
        id: 10607595,
        name: 'test_webhook',
        description: '',
        web_url: 'https://gitlab.com/bastien.terrier/test_webhook',
        avatar_url: null,
        git_ssh_url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
        git_http_url: 'https://gitlab.com/bastien.terrier/test_webhook.git',
        namespace: 'bastien.terrier',
        visibility_level: 20,
        path_with_namespace: 'bastien.terrier/test_webhook',
        default_branch: 'master',
        ci_config_path: null,
        homepage: 'https://gitlab.com/bastien.terrier/test_webhook',
        url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
        ssh_url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
        http_url: 'https://gitlab.com/bastien.terrier/test_webhook.git',
      },
      object_attributes: {
        assignee_id: null,
        author_id: 3360534,
        created_at: '2019-04-09 13:14:44 UTC',
        description: '',
        head_pipeline_id: 55243238,
        id: 27349057,
        iid: 35,
        last_edited_at: null,
        last_edited_by_id: null,
        merge_commit_sha: null,
        merge_error: null,
        merge_params: {
          force_remove_source_branch: '0',
        },
        merge_status: 'cannot_be_merged',
        merge_user_id: null,
        merge_when_pipeline_succeeds: false,
        milestone_id: null,
        source_branch: 'feature/close',
        source_project_id: 10607595,
        state: 'opened',
        target_branch: 'master',
        target_project_id: 10607595,
        time_estimate: 0,
        title: 'bad title...',
        updated_at: '2019-04-11 08:03:11 UTC',
        updated_by_id: null,
        url:
          'https://gitlab.com/bastien.terrier/test_webhook/merge_requests/35',
        source: {
          id: 10607595,
          name: 'test_webhook',
          description: '',
          web_url: 'https://gitlab.com/bastien.terrier/test_webhook',
          avatar_url: null,
          git_ssh_url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
          git_http_url: 'https://gitlab.com/bastien.terrier/test_webhook.git',
          namespace: 'bastien.terrier',
          visibility_level: 20,
          path_with_namespace: 'bastien.terrier/test_webhook',
          default_branch: 'master',
          ci_config_path: null,
          homepage: 'https://gitlab.com/bastien.terrier/test_webhook',
          url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
          ssh_url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
          http_url: 'https://gitlab.com/bastien.terrier/test_webhook.git',
        },
        target: {
          id: 10607595,
          name: 'test_webhook',
          description: '',
          web_url: 'https://gitlab.com/bastien.terrier/test_webhook',
          avatar_url: null,
          git_ssh_url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
          git_http_url: 'https://gitlab.com/bastien.terrier/test_webhook.git',
          namespace: 'bastien.terrier',
          visibility_level: 20,
          path_with_namespace: 'bastien.terrier/test_webhook',
          default_branch: 'master',
          ci_config_path: null,
          homepage: 'https://gitlab.com/bastien.terrier/test_webhook',
          url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
          ssh_url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
          http_url: 'https://gitlab.com/bastien.terrier/test_webhook.git',
        },
        last_commit: {
          id: '1e7d0cb7efbd03776c3d503452313ef492f1f936',
          message: 'fix: Add new file',
          timestamp: '2019-04-04T15:29:56Z',
          url:
            'https://gitlab.com/bastien.terrier/test_webhook/commit/1e7d0cb7efbd03776c3d503452313ef492f1f936',
          author: {
            name: 'Bastien Terrier',
            email: 'bastien.terrier@gmail.com',
          },
        },
        work_in_progress: false,
        total_time_spent: 0,
        human_total_time_spent: null,
        human_time_estimate: null,
        action: 'reopen',
      },
      labels: [],
      changes: {
        state: {
          previous: 'closed',
          current: 'opened',
        },
        updated_at: {
          previous: '2019-04-09 13:17:04 UTC',
          current: '2019-04-11 08:03:11 UTC',
        },
        total_time_spent: {
          previous: null,
          current: 0,
        },
      },
      repository: {
        name: 'test_webhook',
        url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
        description: '',
        homepage: 'https://gitlab.com/bastien.terrier/test_webhook',
      },
    };
    it('isGitlabReopenedPREvent should equal "true"', () => {
      expect(utils.isGitlabReopenedPREvent(gitlabReopenedPREvent)).toBe(true);
    });
    it('isGitlabReopenedPREvent should equal "false"', () => {
      expect(utils.isGitlabReopenedPREvent(githubReopenedPREvent)).toBe(false);
    });
    it('isGithubReopenedPREvent should equal "true"', () => {
      expect(utils.isGithubReopenedPREvent(githubReopenedPREvent)).toBe(true);
    });
    it('isGithubReopenedPREvent should equal "false"', () => {
      expect(utils.isGithubReopenedPREvent(gitlabReopenedPREvent)).toBe(false);
    });
    it('should create a Webhook object according to the Gitlab PR Reopened Hook', () => {
      webhook = new Webhook(gitlabService, githubService);
      webhook.gitToWebhook(gitlabReopenedPREvent);

      expect(webhook.gitType).toBe(GitTypeEnum.Gitlab);
      expect(webhook.gitEvent).toBe(GitEventEnum.ReopenedPR);
      expect(webhook.projectId).toBe(10607595);
      expect(webhook.gitService).toBe(gitlabService);
      expect(webhook.pullRequest.number).toBe(35);
      expect(webhook.pullRequest.title).toBe('bad title...');
      expect(webhook.pullRequest.description).toBe('');
      expect(webhook.pullRequest.sourceBranch).toBe('feature/close');
      expect(webhook.pullRequest.targetBranch).toBe('master');
      expect(webhook.repository.cloneURL).toBe(
        'https://gitlab.com/bastien.terrier/test_webhook',
      );
      expect(webhook.user.login).toBe('bastien.terrier');
      expect(webhook.pullRequest.user.login).toBe('bastien.terrier');
    });

    it('should create a Webhook object according to the Github PR Reopened Hook', () => {
      webhook = new Webhook(gitlabService, githubService);
      webhook.gitToWebhook(githubReopenedPREvent);

      expect(webhook.gitType).toBe(GitTypeEnum.Github);
      expect(webhook.gitEvent).toBe(GitEventEnum.ReopenedPR);
      expect(webhook.gitService).toBe(githubService);
      expect(webhook.pullRequest.number).toBe(129);
      expect(webhook.pullRequest.title).toBe('Update README.md');
      expect(webhook.pullRequest.description).toBe('');
      expect(webhook.pullRequest.sourceBranch).toBe('testingPR');
      expect(webhook.pullRequest.targetBranch).toBe('master');
      expect(webhook.repository.fullName).toBe('bastienterrier/test-webhook');
      expect(webhook.repository.cloneURL).toBe(
        'https://github.com/bastienterrier/test-webhook',
      );
      expect(webhook.user.login).toBe('bastienterrier');
      expect(webhook.pullRequest.user.login).toBe('bastienterrier');
    });
  });

  describe('isMergedPREvent', () => {
    const githubMergedPREvent = {
      action: 'closed',
      number: 129,
      pull_request: {
        url:
          'https://api.github.com/repos/bastienterrier/test-webhook/pulls/129',
        id: 269462455,
        node_id: 'MDExOlB1bGxSZXF1ZXN0MjY5NDYyNDU1',
        html_url: 'https://github.com/bastienterrier/test-webhook/pull/129',
        diff_url:
          'https://github.com/bastienterrier/test-webhook/pull/129.diff',
        patch_url:
          'https://github.com/bastienterrier/test-webhook/pull/129.patch',
        issue_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/issues/129',
        number: 129,
        state: 'closed',
        locked: false,
        title: 'Update README.md',
        user: {
          login: 'bastienterrier',
          id: 25296454,
          node_id: 'MDQ6VXNlcjI1Mjk2NDU0',
          avatar_url: 'https://avatars0.githubusercontent.com/u/25296454?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/bastienterrier',
          html_url: 'https://github.com/bastienterrier',
          followers_url:
            'https://api.github.com/users/bastienterrier/followers',
          following_url:
            'https://api.github.com/users/bastienterrier/following{/other_user}',
          gists_url:
            'https://api.github.com/users/bastienterrier/gists{/gist_id}',
          starred_url:
            'https://api.github.com/users/bastienterrier/starred{/owner}{/repo}',
          subscriptions_url:
            'https://api.github.com/users/bastienterrier/subscriptions',
          organizations_url: 'https://api.github.com/users/bastienterrier/orgs',
          repos_url: 'https://api.github.com/users/bastienterrier/repos',
          events_url:
            'https://api.github.com/users/bastienterrier/events{/privacy}',
          received_events_url:
            'https://api.github.com/users/bastienterrier/received_events',
          type: 'User',
          site_admin: false,
        },
        body: '',
        created_at: '2019-04-11T08:01:50Z',
        updated_at: '2019-04-11T08:05:34Z',
        closed_at: '2019-04-11T08:05:34Z',
        merged_at: '2019-04-11T08:05:34Z',
        merge_commit_sha: '8b4098adbc87b08ad6fd2ad9f3e0fe2eab6900fc',
        assignee: null,
        assignees: [],
        requested_reviewers: [],
        requested_teams: [],
        labels: [],
        milestone: null,
        commits_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/pulls/129/commits',
        review_comments_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/pulls/129/comments',
        review_comment_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/pulls/comments{/number}',
        comments_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/issues/129/comments',
        statuses_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/statuses/796d35504c393c3c019297b974d109eebee4c873',
        head: {
          label: 'bastienterrier:testingPR',
          ref: 'testingPR',
          sha: '796d35504c393c3c019297b974d109eebee4c873',
          user: {
            login: 'bastienterrier',
            id: 25296454,
            node_id: 'MDQ6VXNlcjI1Mjk2NDU0',
            avatar_url: 'https://avatars0.githubusercontent.com/u/25296454?v=4',
            gravatar_id: '',
            url: 'https://api.github.com/users/bastienterrier',
            html_url: 'https://github.com/bastienterrier',
            followers_url:
              'https://api.github.com/users/bastienterrier/followers',
            following_url:
              'https://api.github.com/users/bastienterrier/following{/other_user}',
            gists_url:
              'https://api.github.com/users/bastienterrier/gists{/gist_id}',
            starred_url:
              'https://api.github.com/users/bastienterrier/starred{/owner}{/repo}',
            subscriptions_url:
              'https://api.github.com/users/bastienterrier/subscriptions',
            organizations_url:
              'https://api.github.com/users/bastienterrier/orgs',
            repos_url: 'https://api.github.com/users/bastienterrier/repos',
            events_url:
              'https://api.github.com/users/bastienterrier/events{/privacy}',
            received_events_url:
              'https://api.github.com/users/bastienterrier/received_events',
            type: 'User',
            site_admin: false,
          },
          repo: {
            id: 169373600,
            node_id: 'MDEwOlJlcG9zaXRvcnkxNjkzNzM2MDA=',
            name: 'test-webhook',
            full_name: 'bastienterrier/test-webhook',
            private: false,
            owner: {
              login: 'bastienterrier',
              id: 25296454,
              node_id: 'MDQ6VXNlcjI1Mjk2NDU0',
              avatar_url:
                'https://avatars0.githubusercontent.com/u/25296454?v=4',
              gravatar_id: '',
              url: 'https://api.github.com/users/bastienterrier',
              html_url: 'https://github.com/bastienterrier',
              followers_url:
                'https://api.github.com/users/bastienterrier/followers',
              following_url:
                'https://api.github.com/users/bastienterrier/following{/other_user}',
              gists_url:
                'https://api.github.com/users/bastienterrier/gists{/gist_id}',
              starred_url:
                'https://api.github.com/users/bastienterrier/starred{/owner}{/repo}',
              subscriptions_url:
                'https://api.github.com/users/bastienterrier/subscriptions',
              organizations_url:
                'https://api.github.com/users/bastienterrier/orgs',
              repos_url: 'https://api.github.com/users/bastienterrier/repos',
              events_url:
                'https://api.github.com/users/bastienterrier/events{/privacy}',
              received_events_url:
                'https://api.github.com/users/bastienterrier/received_events',
              type: 'User',
              site_admin: false,
            },
            html_url: 'https://github.com/bastienterrier/test-webhook',
            description: null,
            fork: false,
            url: 'https://api.github.com/repos/bastienterrier/test-webhook',
            forks_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/forks',
            keys_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/keys{/key_id}',
            collaborators_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/collaborators{/collaborator}',
            teams_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/teams',
            hooks_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/hooks',
            issue_events_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/issues/events{/number}',
            events_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/events',
            assignees_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/assignees{/user}',
            branches_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/branches{/branch}',
            tags_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/tags',
            blobs_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/git/blobs{/sha}',
            git_tags_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/git/tags{/sha}',
            git_refs_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/git/refs{/sha}',
            trees_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/git/trees{/sha}',
            statuses_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/statuses/{sha}',
            languages_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/languages',
            stargazers_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/stargazers',
            contributors_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/contributors',
            subscribers_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/subscribers',
            subscription_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/subscription',
            commits_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/commits{/sha}',
            git_commits_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/git/commits{/sha}',
            comments_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/comments{/number}',
            issue_comment_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/issues/comments{/number}',
            contents_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/contents/{+path}',
            compare_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/compare/{base}...{head}',
            merges_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/merges',
            archive_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/{archive_format}{/ref}',
            downloads_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/downloads',
            issues_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/issues{/number}',
            pulls_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/pulls{/number}',
            milestones_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/milestones{/number}',
            notifications_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/notifications{?since,all,participating}',
            labels_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/labels{/name}',
            releases_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/releases{/id}',
            deployments_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/deployments',
            created_at: '2019-02-06T08:14:08Z',
            updated_at: '2019-04-11T07:45:07Z',
            pushed_at: '2019-04-11T08:05:34Z',
            git_url: 'git://github.com/bastienterrier/test-webhook.git',
            ssh_url: 'git@github.com:bastienterrier/test-webhook.git',
            clone_url: 'https://github.com/bastienterrier/test-webhook.git',
            svn_url: 'https://github.com/bastienterrier/test-webhook',
            homepage: null,
            size: 25501,
            stargazers_count: 0,
            watchers_count: 0,
            language: 'JavaScript',
            has_issues: true,
            has_projects: true,
            has_downloads: true,
            has_wiki: true,
            has_pages: false,
            forks_count: 0,
            mirror_url: null,
            archived: false,
            disabled: false,
            open_issues_count: 33,
            license: null,
            forks: 0,
            open_issues: 33,
            watchers: 0,
            default_branch: 'master',
          },
        },
        base: {
          label: 'bastienterrier:master',
          ref: 'master',
          sha: '500872c32c9cfe955576000fc01bae1a0d411ef3',
          user: {
            login: 'bastienterrier',
            id: 25296454,
            node_id: 'MDQ6VXNlcjI1Mjk2NDU0',
            avatar_url: 'https://avatars0.githubusercontent.com/u/25296454?v=4',
            gravatar_id: '',
            url: 'https://api.github.com/users/bastienterrier',
            html_url: 'https://github.com/bastienterrier',
            followers_url:
              'https://api.github.com/users/bastienterrier/followers',
            following_url:
              'https://api.github.com/users/bastienterrier/following{/other_user}',
            gists_url:
              'https://api.github.com/users/bastienterrier/gists{/gist_id}',
            starred_url:
              'https://api.github.com/users/bastienterrier/starred{/owner}{/repo}',
            subscriptions_url:
              'https://api.github.com/users/bastienterrier/subscriptions',
            organizations_url:
              'https://api.github.com/users/bastienterrier/orgs',
            repos_url: 'https://api.github.com/users/bastienterrier/repos',
            events_url:
              'https://api.github.com/users/bastienterrier/events{/privacy}',
            received_events_url:
              'https://api.github.com/users/bastienterrier/received_events',
            type: 'User',
            site_admin: false,
          },
          repo: {
            id: 169373600,
            node_id: 'MDEwOlJlcG9zaXRvcnkxNjkzNzM2MDA=',
            name: 'test-webhook',
            full_name: 'bastienterrier/test-webhook',
            private: false,
            owner: {
              login: 'bastienterrier',
              id: 25296454,
              node_id: 'MDQ6VXNlcjI1Mjk2NDU0',
              avatar_url:
                'https://avatars0.githubusercontent.com/u/25296454?v=4',
              gravatar_id: '',
              url: 'https://api.github.com/users/bastienterrier',
              html_url: 'https://github.com/bastienterrier',
              followers_url:
                'https://api.github.com/users/bastienterrier/followers',
              following_url:
                'https://api.github.com/users/bastienterrier/following{/other_user}',
              gists_url:
                'https://api.github.com/users/bastienterrier/gists{/gist_id}',
              starred_url:
                'https://api.github.com/users/bastienterrier/starred{/owner}{/repo}',
              subscriptions_url:
                'https://api.github.com/users/bastienterrier/subscriptions',
              organizations_url:
                'https://api.github.com/users/bastienterrier/orgs',
              repos_url: 'https://api.github.com/users/bastienterrier/repos',
              events_url:
                'https://api.github.com/users/bastienterrier/events{/privacy}',
              received_events_url:
                'https://api.github.com/users/bastienterrier/received_events',
              type: 'User',
              site_admin: false,
            },
            html_url: 'https://github.com/bastienterrier/test-webhook',
            description: null,
            fork: false,
            url: 'https://api.github.com/repos/bastienterrier/test-webhook',
            forks_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/forks',
            keys_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/keys{/key_id}',
            collaborators_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/collaborators{/collaborator}',
            teams_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/teams',
            hooks_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/hooks',
            issue_events_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/issues/events{/number}',
            events_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/events',
            assignees_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/assignees{/user}',
            branches_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/branches{/branch}',
            tags_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/tags',
            blobs_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/git/blobs{/sha}',
            git_tags_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/git/tags{/sha}',
            git_refs_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/git/refs{/sha}',
            trees_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/git/trees{/sha}',
            statuses_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/statuses/{sha}',
            languages_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/languages',
            stargazers_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/stargazers',
            contributors_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/contributors',
            subscribers_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/subscribers',
            subscription_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/subscription',
            commits_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/commits{/sha}',
            git_commits_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/git/commits{/sha}',
            comments_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/comments{/number}',
            issue_comment_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/issues/comments{/number}',
            contents_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/contents/{+path}',
            compare_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/compare/{base}...{head}',
            merges_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/merges',
            archive_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/{archive_format}{/ref}',
            downloads_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/downloads',
            issues_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/issues{/number}',
            pulls_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/pulls{/number}',
            milestones_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/milestones{/number}',
            notifications_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/notifications{?since,all,participating}',
            labels_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/labels{/name}',
            releases_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/releases{/id}',
            deployments_url:
              'https://api.github.com/repos/bastienterrier/test-webhook/deployments',
            created_at: '2019-02-06T08:14:08Z',
            updated_at: '2019-04-11T07:45:07Z',
            pushed_at: '2019-04-11T08:05:34Z',
            git_url: 'git://github.com/bastienterrier/test-webhook.git',
            ssh_url: 'git@github.com:bastienterrier/test-webhook.git',
            clone_url: 'https://github.com/bastienterrier/test-webhook.git',
            svn_url: 'https://github.com/bastienterrier/test-webhook',
            homepage: null,
            size: 25501,
            stargazers_count: 0,
            watchers_count: 0,
            language: 'JavaScript',
            has_issues: true,
            has_projects: true,
            has_downloads: true,
            has_wiki: true,
            has_pages: false,
            forks_count: 0,
            mirror_url: null,
            archived: false,
            disabled: false,
            open_issues_count: 33,
            license: null,
            forks: 0,
            open_issues: 33,
            watchers: 0,
            default_branch: 'master',
          },
        },
        _links: {
          self: {
            href:
              'https://api.github.com/repos/bastienterrier/test-webhook/pulls/129',
          },
          html: {
            href: 'https://github.com/bastienterrier/test-webhook/pull/129',
          },
          issue: {
            href:
              'https://api.github.com/repos/bastienterrier/test-webhook/issues/129',
          },
          comments: {
            href:
              'https://api.github.com/repos/bastienterrier/test-webhook/issues/129/comments',
          },
          review_comments: {
            href:
              'https://api.github.com/repos/bastienterrier/test-webhook/pulls/129/comments',
          },
          review_comment: {
            href:
              'https://api.github.com/repos/bastienterrier/test-webhook/pulls/comments{/number}',
          },
          commits: {
            href:
              'https://api.github.com/repos/bastienterrier/test-webhook/pulls/129/commits',
          },
          statuses: {
            href:
              'https://api.github.com/repos/bastienterrier/test-webhook/statuses/796d35504c393c3c019297b974d109eebee4c873',
          },
        },
        author_association: 'OWNER',
        draft: false,
        merged: true,
        mergeable: null,
        rebaseable: null,
        mergeable_state: 'unknown',
        merged_by: {
          login: 'bastienterrier',
          id: 25296454,
          node_id: 'MDQ6VXNlcjI1Mjk2NDU0',
          avatar_url: 'https://avatars0.githubusercontent.com/u/25296454?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/bastienterrier',
          html_url: 'https://github.com/bastienterrier',
          followers_url:
            'https://api.github.com/users/bastienterrier/followers',
          following_url:
            'https://api.github.com/users/bastienterrier/following{/other_user}',
          gists_url:
            'https://api.github.com/users/bastienterrier/gists{/gist_id}',
          starred_url:
            'https://api.github.com/users/bastienterrier/starred{/owner}{/repo}',
          subscriptions_url:
            'https://api.github.com/users/bastienterrier/subscriptions',
          organizations_url: 'https://api.github.com/users/bastienterrier/orgs',
          repos_url: 'https://api.github.com/users/bastienterrier/repos',
          events_url:
            'https://api.github.com/users/bastienterrier/events{/privacy}',
          received_events_url:
            'https://api.github.com/users/bastienterrier/received_events',
          type: 'User',
          site_admin: false,
        },
        comments: 0,
        review_comments: 0,
        maintainer_can_modify: false,
        commits: 1,
        additions: 1,
        deletions: 0,
        changed_files: 1,
      },
      repository: {
        id: 169373600,
        node_id: 'MDEwOlJlcG9zaXRvcnkxNjkzNzM2MDA=',
        name: 'test-webhook',
        full_name: 'bastienterrier/test-webhook',
        private: false,
        owner: {
          login: 'bastienterrier',
          id: 25296454,
          node_id: 'MDQ6VXNlcjI1Mjk2NDU0',
          avatar_url: 'https://avatars0.githubusercontent.com/u/25296454?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/bastienterrier',
          html_url: 'https://github.com/bastienterrier',
          followers_url:
            'https://api.github.com/users/bastienterrier/followers',
          following_url:
            'https://api.github.com/users/bastienterrier/following{/other_user}',
          gists_url:
            'https://api.github.com/users/bastienterrier/gists{/gist_id}',
          starred_url:
            'https://api.github.com/users/bastienterrier/starred{/owner}{/repo}',
          subscriptions_url:
            'https://api.github.com/users/bastienterrier/subscriptions',
          organizations_url: 'https://api.github.com/users/bastienterrier/orgs',
          repos_url: 'https://api.github.com/users/bastienterrier/repos',
          events_url:
            'https://api.github.com/users/bastienterrier/events{/privacy}',
          received_events_url:
            'https://api.github.com/users/bastienterrier/received_events',
          type: 'User',
          site_admin: false,
        },
        html_url: 'https://github.com/bastienterrier/test-webhook',
        description: null,
        fork: false,
        url: 'https://api.github.com/repos/bastienterrier/test-webhook',
        forks_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/forks',
        keys_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/keys{/key_id}',
        collaborators_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/collaborators{/collaborator}',
        teams_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/teams',
        hooks_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/hooks',
        issue_events_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/issues/events{/number}',
        events_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/events',
        assignees_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/assignees{/user}',
        branches_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/branches{/branch}',
        tags_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/tags',
        blobs_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/git/blobs{/sha}',
        git_tags_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/git/tags{/sha}',
        git_refs_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/git/refs{/sha}',
        trees_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/git/trees{/sha}',
        statuses_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/statuses/{sha}',
        languages_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/languages',
        stargazers_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/stargazers',
        contributors_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/contributors',
        subscribers_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/subscribers',
        subscription_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/subscription',
        commits_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/commits{/sha}',
        git_commits_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/git/commits{/sha}',
        comments_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/comments{/number}',
        issue_comment_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/issues/comments{/number}',
        contents_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/contents/{+path}',
        compare_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/compare/{base}...{head}',
        merges_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/merges',
        archive_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/{archive_format}{/ref}',
        downloads_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/downloads',
        issues_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/issues{/number}',
        pulls_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/pulls{/number}',
        milestones_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/milestones{/number}',
        notifications_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/notifications{?since,all,participating}',
        labels_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/labels{/name}',
        releases_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/releases{/id}',
        deployments_url:
          'https://api.github.com/repos/bastienterrier/test-webhook/deployments',
        created_at: '2019-02-06T08:14:08Z',
        updated_at: '2019-04-11T07:45:07Z',
        pushed_at: '2019-04-11T08:05:34Z',
        git_url: 'git://github.com/bastienterrier/test-webhook.git',
        ssh_url: 'git@github.com:bastienterrier/test-webhook.git',
        clone_url: 'https://github.com/bastienterrier/test-webhook.git',
        svn_url: 'https://github.com/bastienterrier/test-webhook',
        homepage: null,
        size: 25501,
        stargazers_count: 0,
        watchers_count: 0,
        language: 'JavaScript',
        has_issues: true,
        has_projects: true,
        has_downloads: true,
        has_wiki: true,
        has_pages: false,
        forks_count: 0,
        mirror_url: null,
        archived: false,
        disabled: false,
        open_issues_count: 33,
        license: null,
        forks: 0,
        open_issues: 33,
        watchers: 0,
        default_branch: 'master',
      },
      sender: {
        login: 'bastienterrier',
        id: 25296454,
        node_id: 'MDQ6VXNlcjI1Mjk2NDU0',
        avatar_url: 'https://avatars0.githubusercontent.com/u/25296454?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/bastienterrier',
        html_url: 'https://github.com/bastienterrier',
        followers_url: 'https://api.github.com/users/bastienterrier/followers',
        following_url:
          'https://api.github.com/users/bastienterrier/following{/other_user}',
        gists_url:
          'https://api.github.com/users/bastienterrier/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/bastienterrier/starred{/owner}{/repo}',
        subscriptions_url:
          'https://api.github.com/users/bastienterrier/subscriptions',
        organizations_url: 'https://api.github.com/users/bastienterrier/orgs',
        repos_url: 'https://api.github.com/users/bastienterrier/repos',
        events_url:
          'https://api.github.com/users/bastienterrier/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/bastienterrier/received_events',
        type: 'User',
        site_admin: false,
      },
    };
    const gitlabMergedPREvent = {
      object_kind: 'merge_request',
      event_type: 'merge_request',
      user: {
        name: 'Bastien Terrier',
        username: 'bastien.terrier',
        avatar_url:
          'https://secure.gravatar.com/avatar/a17bda7df8612108bc4442ce57cc6dc3?s=80&d=identicon',
      },
      project: {
        id: 10607595,
        name: 'test_webhook',
        description: '',
        web_url: 'https://gitlab.com/bastien.terrier/test_webhook',
        avatar_url: null,
        git_ssh_url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
        git_http_url: 'https://gitlab.com/bastien.terrier/test_webhook.git',
        namespace: 'bastien.terrier',
        visibility_level: 20,
        path_with_namespace: 'bastien.terrier/test_webhook',
        default_branch: 'master',
        ci_config_path: null,
        homepage: 'https://gitlab.com/bastien.terrier/test_webhook',
        url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
        ssh_url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
        http_url: 'https://gitlab.com/bastien.terrier/test_webhook.git',
      },
      object_attributes: {
        assignee_id: null,
        author_id: 3360534,
        created_at: '2019-04-09 13:14:44 UTC',
        description: '',
        head_pipeline_id: 55243238,
        id: 27349057,
        iid: 35,
        last_edited_at: null,
        last_edited_by_id: null,
        merge_commit_sha: 'c88cdde05cc39fdd875afebd7de76057adcd15b6',
        merge_error: null,
        merge_params: {
          force_remove_source_branch: '0',
        },
        merge_status: 'can_be_merged',
        merge_user_id: null,
        merge_when_pipeline_succeeds: false,
        milestone_id: null,
        source_branch: 'feature/close',
        source_project_id: 10607595,
        state: 'merged',
        target_branch: 'master',
        target_project_id: 10607595,
        time_estimate: 0,
        title: 'bad title...',
        updated_at: '2019-04-11 08:07:56 UTC',
        updated_by_id: null,
        url:
          'https://gitlab.com/bastien.terrier/test_webhook/merge_requests/35',
        source: {
          id: 10607595,
          name: 'test_webhook',
          description: '',
          web_url: 'https://gitlab.com/bastien.terrier/test_webhook',
          avatar_url: null,
          git_ssh_url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
          git_http_url: 'https://gitlab.com/bastien.terrier/test_webhook.git',
          namespace: 'bastien.terrier',
          visibility_level: 20,
          path_with_namespace: 'bastien.terrier/test_webhook',
          default_branch: 'master',
          ci_config_path: null,
          homepage: 'https://gitlab.com/bastien.terrier/test_webhook',
          url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
          ssh_url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
          http_url: 'https://gitlab.com/bastien.terrier/test_webhook.git',
        },
        target: {
          id: 10607595,
          name: 'test_webhook',
          description: '',
          web_url: 'https://gitlab.com/bastien.terrier/test_webhook',
          avatar_url: null,
          git_ssh_url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
          git_http_url: 'https://gitlab.com/bastien.terrier/test_webhook.git',
          namespace: 'bastien.terrier',
          visibility_level: 20,
          path_with_namespace: 'bastien.terrier/test_webhook',
          default_branch: 'master',
          ci_config_path: null,
          homepage: 'https://gitlab.com/bastien.terrier/test_webhook',
          url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
          ssh_url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
          http_url: 'https://gitlab.com/bastien.terrier/test_webhook.git',
        },
        last_commit: {
          id: 'e308f9f4542ad9b3e93b020cdfa67044ab8e0196',
          message:
            'Merge branch master into feature/close\n\n# Conflicts:\n#   README.md',
          timestamp: '2019-04-11T08:07:31Z',
          url:
            'https://gitlab.com/bastien.terrier/test_webhook/commit/e308f9f4542ad9b3e93b020cdfa67044ab8e0196',
          author: {
            name: 'Bastien Terrier',
            email: 'bastien.terrier@gmail.com',
          },
        },
        work_in_progress: false,
        total_time_spent: 0,
        human_total_time_spent: null,
        human_time_estimate: null,
        action: 'merge',
      },
      labels: [],
      changes: {
        state: {
          previous: 'locked',
          current: 'merged',
        },
        updated_at: {
          previous: '2019-04-11 08:07:56 UTC',
          current: '2019-04-11 08:07:56 UTC',
        },
        total_time_spent: {
          previous: null,
          current: 0,
        },
      },
      repository: {
        name: 'test_webhook',
        url: 'git@gitlab.com:bastien.terrier/test_webhook.git',
        description: '',
        homepage: 'https://gitlab.com/bastien.terrier/test_webhook',
      },
    };
    it('isGitlabMergedPREvent should equal "true"', () => {
      expect(utils.isGitlabMergedPREvent(gitlabMergedPREvent)).toBe(true);
    });
    it('isGitlabMergedPREvent should equal "false"', () => {
      expect(utils.isGitlabMergedPREvent(githubMergedPREvent)).toBe(false);
    });
    it('isGithubMergedPREvent should equal "true"', () => {
      expect(utils.isGithubMergedPREvent(githubMergedPREvent)).toBe(true);
    });
    it('isGithubMergedPREvent should equal "false"', () => {
      expect(utils.isGithubMergedPREvent(gitlabMergedPREvent)).toBe(false);
    });
    it('should create a Webhook object according to the Gitlab PR Merged Hook', () => {
      webhook = new Webhook(gitlabService, githubService);
      webhook.gitToWebhook(gitlabMergedPREvent);

      expect(webhook.gitType).toBe(GitTypeEnum.Gitlab);
      expect(webhook.gitEvent).toBe(GitEventEnum.MergedPR);
      expect(webhook.projectId).toBe(10607595);
      expect(webhook.gitService).toBe(gitlabService);
      expect(webhook.pullRequest.number).toBe(35);
      expect(webhook.pullRequest.title).toBe('bad title...');
      expect(webhook.pullRequest.description).toBe('');
      expect(webhook.pullRequest.sourceBranch).toBe('feature/close');
      expect(webhook.pullRequest.targetBranch).toBe('master');
      expect(webhook.repository.cloneURL).toBe(
        'https://gitlab.com/bastien.terrier/test_webhook',
      );
      expect(webhook.user.login).toBe('bastien.terrier');
      expect(webhook.pullRequest.user.login).toBe('bastien.terrier');
    });

    it('should create a Webhook object according to the Github PR Merged Hook', () => {
      webhook = new Webhook(gitlabService, githubService);
      webhook.gitToWebhook(githubMergedPREvent);

      expect(webhook.gitType).toBe(GitTypeEnum.Github);
      expect(webhook.gitEvent).toBe(GitEventEnum.MergedPR);
      expect(webhook.gitService).toBe(githubService);
      expect(webhook.pullRequest.number).toBe(129);
      expect(webhook.pullRequest.title).toBe('Update README.md');
      expect(webhook.pullRequest.description).toBe('');
      expect(webhook.pullRequest.sourceBranch).toBe('testingPR');
      expect(webhook.pullRequest.targetBranch).toBe('master');
      expect(webhook.repository.fullName).toBe('bastienterrier/test-webhook');
      expect(webhook.repository.cloneURL).toBe(
        'https://github.com/bastienterrier/test-webhook',
      );
      expect(webhook.user.login).toBe('bastienterrier');
      expect(webhook.pullRequest.user.login).toBe('bastienterrier');
    });
  });

  describe('isNewRepoEvent', () => {
    const githubNewRepoEvent = {
      action: 'created',
      repository: {
        id: 180810951,
        node_id: 'MDEwOlJlcG9zaXRvcnkxODA4MTA5NTE=',
        name: 'test-repository',
        full_name: 'zenika-open-source/test-repository',
        private: false,
        owner: {
          login: 'zenika-open-source',
          id: 36013040,
          node_id: 'MDEyOk9yZ2FuaXphdGlvbjM2MDEzMDQw',
          avatar_url: 'https://avatars1.githubusercontent.com/u/36013040?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/zenika-open-source',
          html_url: 'https://github.com/zenika-open-source',
          followers_url:
            'https://api.github.com/users/zenika-open-source/followers',
          following_url:
            'https://api.github.com/users/zenika-open-source/following{/other_user}',
          gists_url:
            'https://api.github.com/users/zenika-open-source/gists{/gist_id}',
          starred_url:
            'https://api.github.com/users/zenika-open-source/starred{/owner}{/repo}',
          subscriptions_url:
            'https://api.github.com/users/zenika-open-source/subscriptions',
          organizations_url:
            'https://api.github.com/users/zenika-open-source/orgs',
          repos_url: 'https://api.github.com/users/zenika-open-source/repos',
          events_url:
            'https://api.github.com/users/zenika-open-source/events{/privacy}',
          received_events_url:
            'https://api.github.com/users/zenika-open-source/received_events',
          type: 'Organization',
          site_admin: false,
        },
        html_url: 'https://github.com/zenika-open-source/test-repository',
        description: null,
        fork: false,
        url: 'https://api.github.com/repos/zenika-open-source/test-repository',
        forks_url:
          'https://api.github.com/repos/zenika-open-source/test-repository/forks',
        keys_url:
          'https://api.github.com/repos/zenika-open-source/test-repository/keys{/key_id}',
        collaborators_url:
          'https://api.github.com/repos/zenika-open-source/test-repository/collaborators{/collaborator}',
        teams_url:
          'https://api.github.com/repos/zenika-open-source/test-repository/teams',
        hooks_url:
          'https://api.github.com/repos/zenika-open-source/test-repository/hooks',
        issue_events_url:
          'https://api.github.com/repos/zenika-open-source/test-repository/issues/events{/number}',
        events_url:
          'https://api.github.com/repos/zenika-open-source/test-repository/events',
        assignees_url:
          'https://api.github.com/repos/zenika-open-source/test-repository/assignees{/user}',
        branches_url:
          'https://api.github.com/repos/zenika-open-source/test-repository/branches{/branch}',
        tags_url:
          'https://api.github.com/repos/zenika-open-source/test-repository/tags',
        blobs_url:
          'https://api.github.com/repos/zenika-open-source/test-repository/git/blobs{/sha}',
        git_tags_url:
          'https://api.github.com/repos/zenika-open-source/test-repository/git/tags{/sha}',
        git_refs_url:
          'https://api.github.com/repos/zenika-open-source/test-repository/git/refs{/sha}',
        trees_url:
          'https://api.github.com/repos/zenika-open-source/test-repository/git/trees{/sha}',
        statuses_url:
          'https://api.github.com/repos/zenika-open-source/test-repository/statuses/{sha}',
        languages_url:
          'https://api.github.com/repos/zenika-open-source/test-repository/languages',
        stargazers_url:
          'https://api.github.com/repos/zenika-open-source/test-repository/stargazers',
        contributors_url:
          'https://api.github.com/repos/zenika-open-source/test-repository/contributors',
        subscribers_url:
          'https://api.github.com/repos/zenika-open-source/test-repository/subscribers',
        subscription_url:
          'https://api.github.com/repos/zenika-open-source/test-repository/subscription',
        commits_url:
          'https://api.github.com/repos/zenika-open-source/test-repository/commits{/sha}',
        git_commits_url:
          'https://api.github.com/repos/zenika-open-source/test-repository/git/commits{/sha}',
        comments_url:
          'https://api.github.com/repos/zenika-open-source/test-repository/comments{/number}',
        issue_comment_url:
          'https://api.github.com/repos/zenika-open-source/test-repository/issues/comments{/number}',
        contents_url:
          'https://api.github.com/repos/zenika-open-source/test-repository/contents/{+path}',
        compare_url:
          'https://api.github.com/repos/zenika-open-source/test-repository/compare/{base}...{head}',
        merges_url:
          'https://api.github.com/repos/zenika-open-source/test-repository/merges',
        archive_url:
          'https://api.github.com/repos/zenika-open-source/test-repository/{archive_format}{/ref}',
        downloads_url:
          'https://api.github.com/repos/zenika-open-source/test-repository/downloads',
        issues_url:
          'https://api.github.com/repos/zenika-open-source/test-repository/issues{/number}',
        pulls_url:
          'https://api.github.com/repos/zenika-open-source/test-repository/pulls{/number}',
        milestones_url:
          'https://api.github.com/repos/zenika-open-source/test-repository/milestones{/number}',
        notifications_url:
          'https://api.github.com/repos/zenika-open-source/test-repository/notifications{?since,all,participating}',
        labels_url:
          'https://api.github.com/repos/zenika-open-source/test-repository/labels{/name}',
        releases_url:
          'https://api.github.com/repos/zenika-open-source/test-repository/releases{/id}',
        deployments_url:
          'https://api.github.com/repos/zenika-open-source/test-repository/deployments',
        created_at: '2019-04-11T14:34:40Z',
        updated_at: '2019-04-11T14:34:40Z',
        pushed_at: null,
        git_url: 'git://github.com/zenika-open-source/test-repository.git',
        ssh_url: 'git@github.com:zenika-open-source/test-repository.git',
        clone_url: 'https://github.com/zenika-open-source/test-repository.git',
        svn_url: 'https://github.com/zenika-open-source/test-repository',
        homepage: null,
        size: 0,
        stargazers_count: 0,
        watchers_count: 0,
        language: null,
        has_issues: true,
        has_projects: true,
        has_downloads: true,
        has_wiki: true,
        has_pages: false,
        forks_count: 0,
        mirror_url: null,
        archived: false,
        disabled: false,
        open_issues_count: 0,
        license: null,
        forks: 0,
        open_issues: 0,
        watchers: 0,
        default_branch: 'master',
      },
      organization: {
        login: 'zenika-open-source',
        id: 36013040,
        node_id: 'MDEyOk9yZ2FuaXphdGlvbjM2MDEzMDQw',
        url: 'https://api.github.com/orgs/zenika-open-source',
        repos_url: 'https://api.github.com/orgs/zenika-open-source/repos',
        events_url: 'https://api.github.com/orgs/zenika-open-source/events',
        hooks_url: 'https://api.github.com/orgs/zenika-open-source/hooks',
        issues_url: 'https://api.github.com/orgs/zenika-open-source/issues',
        members_url:
          'https://api.github.com/orgs/zenika-open-source/members{/member}',
        public_members_url:
          'https://api.github.com/orgs/zenika-open-source/public_members{/member}',
        avatar_url: 'https://avatars1.githubusercontent.com/u/36013040?v=4',
        description: '',
      },
      sender: {
        login: 'bastienterrier',
        id: 25296454,
        node_id: 'MDQ6VXNlcjI1Mjk2NDU0',
        avatar_url: 'https://avatars0.githubusercontent.com/u/25296454?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/bastienterrier',
        html_url: 'https://github.com/bastienterrier',
        followers_url: 'https://api.github.com/users/bastienterrier/followers',
        following_url:
          'https://api.github.com/users/bastienterrier/following{/other_user}',
        gists_url:
          'https://api.github.com/users/bastienterrier/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/bastienterrier/starred{/owner}{/repo}',
        subscriptions_url:
          'https://api.github.com/users/bastienterrier/subscriptions',
        organizations_url: 'https://api.github.com/users/bastienterrier/orgs',
        repos_url: 'https://api.github.com/users/bastienterrier/repos',
        events_url:
          'https://api.github.com/users/bastienterrier/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/bastienterrier/received_events',
        type: 'User',
        site_admin: false,
      },
    };
    it('isGithubNewRepoEvent should equal "true"', () => {
      expect(utils.isGithubNewRepoEvent(githubNewRepoEvent)).toBe(true);
    });
    it('isGitlabClosedPREvent should equal "false"', () => {
      expect(utils.isGitlabClosedPREvent(githubNewRepoEvent)).toBe(false);
    });

    it('should create a Webhook object according to the Github New Repo Hook', () => {
      webhook = new Webhook(gitlabService, githubService);
      webhook.gitToWebhook(githubNewRepoEvent);

      expect(webhook.gitType).toBe(GitTypeEnum.Github);
      expect(webhook.gitEvent).toBe(GitEventEnum.NewRepo);
      expect(webhook.gitService).toBe(githubService);
      expect(webhook.repository.name).toBe('test-repository');
      expect(webhook.repository.description).toBe(null);
      expect(webhook.repository.fullName).toBe(
        'zenika-open-source/test-repository',
      );
      expect(webhook.repository.cloneURL).toBe(
        'https://github.com/zenika-open-source/test-repository',
      );
      expect(webhook.user.login).toBe('bastienterrier');
    });
  });
});
