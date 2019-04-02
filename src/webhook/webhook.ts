import {
  GitTypeEnum,
  isGitlabPushEvent,
  isGithubPushEvent,
  GitEventEnum,
  CommitStatusEnum,
  isGithubBranchEvent,
  isGitlabBranchEvent,
  isGithubIssueEvent,
  isGitlabIssueEvent,
  isGithubNewRepoEvent,
  isGithubNewPREvent,
  isGitlabNewPREvent,
  isGithubIssueCommentEvent,
  isGithubPRCommentEvent,
  isGitlabIssueCommentEvent,
  isGitlabPRCommentEvent,
} from './utils.enum';
import { GitlabService } from '../gitlab/gitlab.service';
import { GithubService } from '../github/github.service';
import { GitlabEvent } from '../gitlab/gitlabEvent';
import { GithubEvent } from '../github/githubEvent';
import { GitCommitStatusInfos } from '../git/gitCommitStatusInfos';
import { GitApiInfos } from '../git/gitApiInfos';

export class WebhookIssue {
  number: number;
  title: string;
}

export class WebhookCommit {
  sha: string;
  message: string;

  constructor(sha: string, message: string) {
    this.sha = sha;
    this.message = message;
  }
}

export class WebhookRepository {
  fullName: string;
  name: string;
  description: string;
  cloneURL: string;
}

export class WebhookPR {
  title: string;
  description: string;
  number: number;
}

export class WebhookComment {
  id: number;
  description: string;
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

  constructor(
    private readonly gitlabService: GitlabService,
    private readonly githubService: GithubService,
  ) {
    this.repository = new WebhookRepository();
    this.commits = new Array<WebhookCommit>();
    this.issue = new WebhookIssue();
    this.pullRequest = new WebhookPR();
    this.comment = new WebhookComment();
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

  getIssueTitle(): string {
    return this.issue.title;
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

  getRemoteEnvs(): string {
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
        this.commits.push(commit);
      });
      this.branchName = git.ref.split('/')[1];
      this.repository.cloneURL = git.project.git_http_url;
    } else if (isGitlabBranchEvent(git)) {
      this.gitType = GitTypeEnum.Gitlab;
      this.gitEvent = GitEventEnum.NewBranch;
      this.gitService = this.gitlabService;
      this.branchName = git.ref.substring(11);
      this.projectId = git.project_id;
      this.repository.cloneURL = git.project.git_http_url;
    } else if (isGithubPushEvent(git)) {
      this.gitType = GitTypeEnum.Github;
      this.gitEvent = GitEventEnum.Push;
      this.gitService = this.githubService;
      this.repository.fullName = git.repository.full_name;
      git.commits.forEach(c => {
        const commit = new WebhookCommit(c.id, c.message);
        this.commits.push(commit);
      });
      this.branchName = git.ref.substring(11);
      this.repository.cloneURL = git.repository.clone_url;
    } else if (isGithubBranchEvent(git)) {
      this.gitType = GitTypeEnum.Github;
      this.gitEvent = GitEventEnum.NewBranch;
      this.gitService = this.githubService;
      this.branchName = git.ref;
    } else if (isGithubIssueEvent(git)) {
      this.gitType = GitTypeEnum.Github;
      this.gitEvent = GitEventEnum.NewIssue;
      this.gitService = this.githubService;
      this.issue.number = git.issue.number;
      this.issue.title = git.issue.title;
      this.repository.fullName = git.repository.full_name;
      this.repository.cloneURL = git.repository.clone_url;
    } else if (isGitlabIssueEvent(git)) {
      this.gitType = GitTypeEnum.Gitlab;
      this.gitEvent = GitEventEnum.NewIssue;
      this.gitService = this.gitlabService;
      this.issue.number = git.object_attributes.iid;
      this.issue.title = git.object_attributes.title;
      this.projectId = git.object_attributes.project_id;
      this.repository.cloneURL = git.project.git_http_url;
    } else if (isGithubNewPREvent(git)) {
      this.gitType = GitTypeEnum.Github;
      this.gitEvent = GitEventEnum.NewPR;
      this.gitService = this.githubService;
      this.pullRequest.title = git.pull_request.title;
      this.pullRequest.description = git.pull_request.body;
      this.pullRequest.number = git.number;
      this.repository.fullName = git.repository.full_name;
      this.repository.cloneURL = git.repository.clone_url;
    } else if (isGitlabNewPREvent(git)) {
      this.gitType = GitTypeEnum.Gitlab;
      this.gitEvent = GitEventEnum.NewPR;
      this.gitService = this.gitlabService;
      this.projectId = git.project.id;
      this.pullRequest.title = git.object_attributes.title;
      this.pullRequest.description = git.object_attributes.description;
      this.pullRequest.number = git.object_attributes.iid;
      this.repository.cloneURL = git.project.git_http_url;
    } else if (isGithubIssueCommentEvent(git)) {
      this.gitType = GitTypeEnum.Github;
      this.gitEvent = GitEventEnum.NewIssueComment;
      this.gitService = this.githubService;
      this.repository.fullName = git.repository.full_name;
      this.repository.cloneURL = git.repository.clone_url;
      this.comment.id = git.comment.id;
      this.comment.description = git.comment.body;
    } else if (isGithubPRCommentEvent(git)) {
      this.gitType = GitTypeEnum.Github;
      this.gitEvent = GitEventEnum.NewPRComment;
      this.gitService = this.githubService;
      this.repository.fullName = git.repository.full_name;
      this.repository.cloneURL = git.repository.clone_url;
      this.comment.id = git.comment.id;
      this.comment.description = git.comment.body;
    } else if (isGitlabIssueCommentEvent(git)) {
      this.gitType = GitTypeEnum.Gitlab;
      this.gitEvent = GitEventEnum.NewIssueComment;
      this.gitService = this.gitlabService;
      this.projectId = git.project.id;
      this.repository.cloneURL = git.project.git_http_url;
      this.comment.id = git.object_attributes.id;
      this.comment.description = git.object_attributes.description;
    } else if (isGitlabPRCommentEvent(git)) {
      this.gitType = GitTypeEnum.Gitlab;
      this.gitEvent = GitEventEnum.NewPRComment;
      this.gitService = this.gitlabService;
      this.projectId = git.project.id;
      this.repository.cloneURL = git.project.git_http_url;
      this.comment.id = git.object_attributes.id;
      this.comment.description = git.object_attributes.description;
    } else if (isGithubNewRepoEvent(git)) {
      // Caution: need to be after isGithubIssueComment and isGithubPRComment
      this.gitType = GitTypeEnum.Github;
      this.gitEvent = GitEventEnum.NewRepo;
      this.gitService = this.githubService;
      this.repository.fullName = git.repository.full_name;
      this.repository.name = git.repository.name;
      this.repository.description = git.repository.description;
      this.repository.cloneURL = git.repository.clone_url;
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
}
