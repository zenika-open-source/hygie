import * as utils from './utils.enum';
import { CommitStatusEnum } from './utils.enum';
describe('Utils Enum', () => {
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
  });

  describe('isBranchEvent', () => {
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
      expect(utils.isGitlabBranchEvent(gitlabNewBranchEvent)).toBe(true);
    });

    it('isGitlabBranchEvent should equal "false"', () => {
      expect(utils.isGitlabBranchEvent(githubNewBranchEvent)).toBe(false);
    });

    it('isGithubBranchEvent should equal "true"', () => {
      expect(utils.isGithubBranchEvent(githubNewBranchEvent)).toBe(true);
    });

    it('isGithubBranchEvent should equal "false"', () => {
      expect(utils.isGithubBranchEvent(gitlabNewBranchEvent)).toBe(false);
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

    it('isGitlabIssueEvent should equal "true"', () => {
      expect(utils.isGitlabNewPREvent(gitlabNewPREvent)).toBe(true);
    });
    it('isGitlabIssueEvent should equal "false"', () => {
      expect(utils.isGitlabNewPREvent(githubNewPREvent)).toBe(false);
    });
    it('isGithubNewPREvent should equal "true"', () => {
      expect(utils.isGithubNewPREvent(githubNewPREvent)).toBe(true);
    });
    it('isGithubNewPREvent should equal "false"', () => {
      expect(utils.isGithubNewPREvent(gitlabNewPREvent)).toBe(false);
    });
  });
});
