import {
  GitTypeEnum,
  isGitlabPushEvent,
  isGithubPushEvent,
  GitEventEnum,
  CommitStatusEnum,
  isGithubNewBranchEvent,
  isGitlabNewBranchEvent,
  isGithubIssueEvent,
  isGitlabIssueEvent,
  isGithubNewRepoEvent,
  isGithubNewPREvent,
  isGitlabNewPREvent,
  isGithubIssueCommentEvent,
  isGithubPRCommentEvent,
  isGitlabIssueCommentEvent,
  isGitlabPRCommentEvent,
  isGithubClosedPREvent,
  isGithubMergedPREvent,
  isGitlabMergedPREvent,
  isGitlabClosedPREvent,
  isGitlabReopenedPREvent,
  isGithubReopenedPREvent,
  isGithubDeletedBranchEvent,
  isGitlabDeletedBranchEvent,
} from './utils.enum';
import { GitlabService } from '../gitlab/gitlab.service';
import { GithubService } from '../github/github.service';
import { GitlabEvent } from '../gitlab/gitlabEvent';
import { GithubEvent } from '../github/githubEvent';
import { GitCommitStatusInfos } from '../git/gitCommitStatusInfos';
import { GitApiInfos } from '../git/gitApiInfos';
import { CronInterface } from '../scheduler/cron.interface';
import { Utils } from '../utils/utils';

export class WebhookIssue {
  number: number;
  title: string;
  description: string;
}

export class WebhookCommit {
  sha: string;
  message: string;
  added?: string[];
  modified?: string[];
  removed?: string[];

  constructor(sha: string, message: string) {
    this.sha = sha;
    this.message = message;
    this.added = new Array();
    this.modified = new Array();
    this.removed = new Array();
  }
}

export class WebhookRepository {
  fullName: string;
  name: string;
  description: string;
  cloneURL: string;
  defaultBranchName: string;
}

export class WebhookPR {
  title: string;
  description: string;
  number: number;
  sourceBranch?: string;
  targetBranch?: string;
}

export class WebhookComment {
  id: number;
  description: string;
}

export class WebhookUser {
  login: string;
}

export class Webhook {
  gitType: GitTypeEnum;
  gitEvent: GitEventEnum;
  gitService: GitlabService | GithubService;
  commits: WebhookCommit[];
  projectId: number;
  repository: WebhookRepository;
  branchName: string;
  issue: WebhookIssue;
  pullRequest: WebhookPR;
  comment: WebhookComment;
  user: WebhookUser;

  constructor(
    private readonly gitlabService: GitlabService,
    private readonly githubService: GithubService,
  ) {
    this.repository = new WebhookRepository();
    this.commits = new Array<WebhookCommit>();
    this.issue = new WebhookIssue();
    this.pullRequest = new WebhookPR();
    this.comment = new WebhookComment();
    this.user = new WebhookUser();
  }

  getUser(): WebhookUser {
    return this.user;
  }

  getAllCommits(): WebhookCommit[] {
    return this.commits;
  }

  getPullRequestNumber(): number {
    return this.pullRequest.number;
  }

  getPullRequestDescription(): string {
    return this.pullRequest.description;
  }

  getPullRequestTitle(): string {
    return this.pullRequest.title;
  }

  getBranchName(): string {
    return this.branchName;
  }

  getDefaultBranchName(): string {
    return this.repository.defaultBranchName;
  }

  getIssueTitle(): string {
    return this.issue.title;
  }

  getIssueDescription(): string {
    return this.issue.description;
  }

  getIssueNumber(): number {
    return this.issue.number;
  }

  getGitType(): GitTypeEnum {
    return this.gitType;
  }

  getGitEvent(): GitEventEnum {
    return this.gitEvent;
  }

  getCloneURL(): string {
    return this.repository.cloneURL;
  }

  getCommentId(): number {
    return this.comment.id;
  }

  getCommentDescription(): string {
    return this.comment.description;
  }

  getRemoteDirectory(): string {
    const splitedURL = this.getCloneURL().split('/');

    return (
      splitedURL[splitedURL.length - 2] +
      '/' +
      splitedURL[splitedURL.length - 1].replace('.git', '')
    );
  }

  gitToWebhook(git: GitlabEvent | GithubEvent): void {
    this.gitEvent = GitEventEnum.Undefined;
    this.gitType = GitTypeEnum.Undefined;

    if (isGitlabPushEvent(git)) {
      this.gitType = GitTypeEnum.Gitlab;
      this.gitEvent = GitEventEnum.Push;
      this.projectId = git.project_id;
      this.gitService = this.gitlabService;
      git.commits.forEach(c => {
        const commit = new WebhookCommit(c.id, c.message);
        commit.added = c.added;
        commit.modified = c.modified;
        commit.removed = c.removed;
        this.commits.push(commit);
      });
      this.branchName = git.ref.substring(11);
      this.repository.cloneURL = git.project.git_http_url;
      this.repository.defaultBranchName = git.project.default_branch;
      this.user.login = git.user_username;
    } else if (isGitlabNewBranchEvent(git)) {
      this.gitType = GitTypeEnum.Gitlab;
      this.gitEvent = GitEventEnum.NewBranch;
      this.gitService = this.gitlabService;
      this.branchName = git.ref.substring(11);
      this.projectId = git.project_id;
      this.repository.cloneURL = git.project.git_http_url;
      this.repository.defaultBranchName = git.project.default_branch;
      this.user.login = git.user_username;
    } else if (isGitlabDeletedBranchEvent(git)) {
      this.gitType = GitTypeEnum.Gitlab;
      this.gitEvent = GitEventEnum.DeletedBranch;
      this.gitService = this.gitlabService;
      this.branchName = git.ref.substring(11);
      this.projectId = git.project_id;
      this.repository.cloneURL = git.project.git_http_url;
      this.repository.defaultBranchName = git.project.default_branch;
      this.user.login = git.user_username;
    } else if (isGithubPushEvent(git)) {
      this.gitType = GitTypeEnum.Github;
      this.gitEvent = GitEventEnum.Push;
      this.gitService = this.githubService;
      this.repository.fullName = git.repository.full_name;
      git.commits.forEach(c => {
        const commit = new WebhookCommit(c.id, c.message);
        commit.added = c.added;
        commit.modified = c.modified;
        commit.removed = c.removed;
        this.commits.push(commit);
      });
      this.branchName = git.ref.substring(11);
      this.repository.cloneURL = git.repository.clone_url;
      this.repository.defaultBranchName = git.repository.default_branch;
      this.user.login = git.sender.login;
    } else if (isGithubNewBranchEvent(git)) {
      this.gitType = GitTypeEnum.Github;
      this.gitEvent = GitEventEnum.NewBranch;
      this.gitService = this.githubService;
      this.branchName = git.ref;
      this.repository.cloneURL = git.repository.clone_url;
      this.repository.fullName = git.repository.full_name;
      this.repository.defaultBranchName = git.repository.default_branch;
      this.user.login = git.sender.login;
    } else if (isGithubDeletedBranchEvent(git)) {
      this.gitType = GitTypeEnum.Github;
      this.gitEvent = GitEventEnum.DeletedBranch;
      this.gitService = this.githubService;
      this.branchName = git.ref;
      this.repository.cloneURL = git.repository.clone_url;
      this.repository.fullName = git.repository.full_name;
      this.repository.defaultBranchName = git.repository.default_branch;
      this.user.login = git.sender.login;
    } else if (isGithubIssueEvent(git)) {
      this.gitType = GitTypeEnum.Github;
      this.gitEvent = GitEventEnum.NewIssue;
      this.gitService = this.githubService;
      this.issue.number = git.issue.number;
      this.issue.title = git.issue.title;
      this.issue.description = git.issue.body;
      this.repository.fullName = git.repository.full_name;
      this.repository.cloneURL = git.repository.clone_url;
      this.repository.defaultBranchName = git.repository.default_branch;
      this.user.login = git.sender.login;
    } else if (isGitlabIssueEvent(git)) {
      this.gitType = GitTypeEnum.Gitlab;
      this.gitEvent = GitEventEnum.NewIssue;
      this.gitService = this.gitlabService;
      this.issue.number = git.object_attributes.iid;
      this.issue.title = git.object_attributes.title;
      this.issue.description = git.object_attributes.description;
      this.projectId = git.object_attributes.project_id;
      this.repository.cloneURL = git.project.git_http_url;
      this.repository.defaultBranchName = git.project.default_branch;
      this.user.login = git.user.username;
    } else if (isGithubNewPREvent(git)) {
      this.gitType = GitTypeEnum.Github;
      this.gitEvent = GitEventEnum.NewPR;
      this.gitService = this.githubService;
      this.pullRequest.title = git.pull_request.title;
      this.pullRequest.description = git.pull_request.body;
      this.pullRequest.number = git.number;
      this.repository.fullName = git.repository.full_name;
      this.repository.cloneURL = git.repository.clone_url;
      this.pullRequest.sourceBranch = git.pull_request.head.ref;
      this.pullRequest.targetBranch = git.pull_request.base.ref;
      this.repository.defaultBranchName = git.repository.default_branch;
      this.user.login = git.sender.login;
    } else if (isGitlabNewPREvent(git)) {
      this.gitType = GitTypeEnum.Gitlab;
      this.gitEvent = GitEventEnum.NewPR;
      this.gitService = this.gitlabService;
      this.projectId = git.project.id;
      this.pullRequest.title = git.object_attributes.title;
      this.pullRequest.description = git.object_attributes.description;
      this.pullRequest.number = git.object_attributes.iid;
      this.repository.cloneURL = git.project.git_http_url;
      this.pullRequest.sourceBranch = git.object_attributes.source_branch;
      this.pullRequest.targetBranch = git.object_attributes.target_branch;
      this.repository.defaultBranchName = git.project.default_branch;
      this.user.login = git.user.username;
    } else if (isGithubIssueCommentEvent(git)) {
      this.gitType = GitTypeEnum.Github;
      this.gitEvent = GitEventEnum.NewIssueComment;
      this.gitService = this.githubService;
      this.repository.fullName = git.repository.full_name;
      this.repository.cloneURL = git.repository.clone_url;
      this.comment.id = git.comment.id;
      this.comment.description = git.comment.body;
      this.issue.title = git.issue.title;
      this.issue.number = git.issue.number;
      this.issue.description = git.issue.body;
      this.repository.defaultBranchName = git.repository.default_branch;
      this.user.login = git.sender.login;
    } else if (isGithubPRCommentEvent(git)) {
      this.gitType = GitTypeEnum.Github;
      this.gitEvent = GitEventEnum.NewPRComment;
      this.gitService = this.githubService;
      this.repository.fullName = git.repository.full_name;
      this.repository.cloneURL = git.repository.clone_url;
      this.comment.id = git.comment.id;
      this.comment.description = git.comment.body;
      this.pullRequest.description = git.issue.body;
      this.pullRequest.title = git.issue.title;
      this.pullRequest.number = git.issue.number;
      this.repository.defaultBranchName = git.repository.default_branch;
      this.user.login = git.sender.login;
      /**
       * this.pullRequest.sourceBranch = git.merge_request.source_branch;
       * this.pullRequest.targetBranch = git.merge_request.target_branch;
       */
    } else if (isGitlabIssueCommentEvent(git)) {
      this.gitType = GitTypeEnum.Gitlab;
      this.gitEvent = GitEventEnum.NewIssueComment;
      this.gitService = this.gitlabService;
      this.projectId = git.project.id;
      this.repository.cloneURL = git.project.git_http_url;
      this.comment.id = git.object_attributes.id;
      this.comment.description = git.object_attributes.description;
      this.issue.title = git.issue.title;
      this.issue.number = git.issue.iid;
      this.issue.description = git.issue.description;
      this.repository.defaultBranchName = git.project.default_branch;
      this.user.login = git.user.username;
    } else if (isGitlabPRCommentEvent(git)) {
      this.gitType = GitTypeEnum.Gitlab;
      this.gitEvent = GitEventEnum.NewPRComment;
      this.gitService = this.gitlabService;
      this.projectId = git.project.id;
      this.repository.cloneURL = git.project.git_http_url;
      this.comment.id = git.object_attributes.id;
      this.comment.description = git.object_attributes.description;
      this.pullRequest.title = git.merge_request.title;
      this.pullRequest.description = git.merge_request.description;
      this.pullRequest.number = git.merge_request.iid;
      this.pullRequest.sourceBranch = git.merge_request.source_branch;
      this.pullRequest.targetBranch = git.merge_request.target_branch;
      this.repository.defaultBranchName = git.project.default_branch;
      this.user.login = git.user.username;
    } else if (isGithubClosedPREvent(git)) {
      this.gitType = GitTypeEnum.Github;
      this.gitEvent = GitEventEnum.ClosedPR;
      this.gitService = this.githubService;
      this.pullRequest.title = git.pull_request.title;
      this.pullRequest.description = git.pull_request.body;
      this.pullRequest.number = git.number;
      this.repository.fullName = git.repository.full_name;
      this.repository.cloneURL = git.repository.clone_url;
      this.pullRequest.sourceBranch = git.pull_request.head.ref;
      this.pullRequest.targetBranch = git.pull_request.base.ref;
      this.repository.defaultBranchName = git.repository.default_branch;
      this.user.login = git.sender.login;
    } else if (isGithubMergedPREvent(git)) {
      this.gitType = GitTypeEnum.Github;
      this.gitEvent = GitEventEnum.MergedPR;
      this.gitService = this.githubService;
      this.pullRequest.title = git.pull_request.title;
      this.pullRequest.description = git.pull_request.body;
      this.pullRequest.number = git.number;
      this.repository.fullName = git.repository.full_name;
      this.repository.cloneURL = git.repository.clone_url;
      this.pullRequest.sourceBranch = git.pull_request.head.ref;
      this.pullRequest.targetBranch = git.pull_request.base.ref;
      this.repository.defaultBranchName = git.repository.default_branch;
      this.user.login = git.sender.login;
    } else if (isGithubReopenedPREvent(git)) {
      this.gitType = GitTypeEnum.Github;
      this.gitEvent = GitEventEnum.ReopenedPR;
      this.gitService = this.githubService;
      this.pullRequest.title = git.pull_request.title;
      this.pullRequest.description = git.pull_request.body;
      this.pullRequest.number = git.number;
      this.repository.fullName = git.repository.full_name;
      this.repository.cloneURL = git.repository.clone_url;
      this.pullRequest.sourceBranch = git.pull_request.head.ref;
      this.pullRequest.targetBranch = git.pull_request.base.ref;
      this.repository.defaultBranchName = git.repository.default_branch;
      this.user.login = git.sender.login;
    } else if (isGitlabMergedPREvent(git)) {
      this.gitType = GitTypeEnum.Gitlab;
      this.gitEvent = GitEventEnum.MergedPR;
      this.gitService = this.gitlabService;
      this.projectId = git.project.id;
      this.pullRequest.title = git.object_attributes.title;
      this.pullRequest.description = git.object_attributes.description;
      this.pullRequest.number = git.object_attributes.iid;
      this.repository.cloneURL = git.project.git_http_url;
      this.pullRequest.sourceBranch = git.object_attributes.source_branch;
      this.pullRequest.targetBranch = git.object_attributes.target_branch;
      this.repository.defaultBranchName = git.project.default_branch;
      this.user.login = git.user.username;
    } else if (isGitlabClosedPREvent(git)) {
      this.gitType = GitTypeEnum.Gitlab;
      this.gitEvent = GitEventEnum.ClosedPR;
      this.gitService = this.gitlabService;
      this.projectId = git.project.id;
      this.pullRequest.title = git.object_attributes.title;
      this.pullRequest.description = git.object_attributes.description;
      this.pullRequest.number = git.object_attributes.iid;
      this.repository.cloneURL = git.project.git_http_url;
      this.pullRequest.sourceBranch = git.object_attributes.source_branch;
      this.pullRequest.targetBranch = git.object_attributes.target_branch;
      this.repository.defaultBranchName = git.project.default_branch;
      this.user.login = git.user.username;
    } else if (isGitlabReopenedPREvent(git)) {
      this.gitType = GitTypeEnum.Gitlab;
      this.gitEvent = GitEventEnum.ReopenedPR;
      this.gitService = this.gitlabService;
      this.projectId = git.project.id;
      this.pullRequest.title = git.object_attributes.title;
      this.pullRequest.description = git.object_attributes.description;
      this.pullRequest.number = git.object_attributes.iid;
      this.repository.cloneURL = git.project.git_http_url;
      this.pullRequest.sourceBranch = git.object_attributes.source_branch;
      this.pullRequest.targetBranch = git.object_attributes.target_branch;
      this.repository.defaultBranchName = git.project.default_branch;
      this.user.login = git.user.username;
    } else if (isGithubNewRepoEvent(git)) {
      // Caution: need to be after all
      this.gitType = GitTypeEnum.Github;
      this.gitEvent = GitEventEnum.NewRepo;
      this.gitService = this.githubService;
      this.repository.fullName = git.repository.full_name;
      this.repository.name = git.repository.name;
      this.repository.description = git.repository.description;
      this.repository.cloneURL = git.repository.clone_url;
      this.repository.defaultBranchName = git.repository.default_branch;
      this.user.login = git.sender.login;
    }
  }

  getGitCommitStatusInfos(
    commitStatus: CommitStatusEnum,
    commitId: string,
  ): GitCommitStatusInfos {
    const commitStatusInfos = new GitCommitStatusInfos();
    commitStatusInfos.commitStatus = commitStatus;
    commitStatusInfos.commitSha = commitId;

    return commitStatusInfos;
  }

  getGitApiInfos(): GitApiInfos {
    const gitApiInfos: GitApiInfos = new GitApiInfos();
    gitApiInfos.git = this.gitType;

    if (this.gitType === GitTypeEnum.Gitlab) {
      gitApiInfos.projectId = this.projectId.toString();
    } else if (this.gitType === GitTypeEnum.Github) {
      gitApiInfos.repositoryFullName = this.repository.fullName;
    }

    return gitApiInfos;
  }

  setCronWebhook(cron: CronInterface): void {
    this.gitType = Utils.whichGitType(cron.projectURL);
    this.gitEvent = GitEventEnum.Cron;

    this.repository = new WebhookRepository();
    this.repository.cloneURL = cron.projectURL;

    if (this.gitType === GitTypeEnum.Github) {
      this.gitService = this.githubService;
      this.repository.fullName = Utils.getRepositoryFullName(cron.projectURL);
    } else if (this.gitType === GitTypeEnum.Gitlab) {
      this.gitService = this.gitlabService;
      this.projectId = cron.gitlabProjectId;
    }
  }
}
