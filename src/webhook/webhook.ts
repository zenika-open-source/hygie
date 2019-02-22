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

// tslint:disable-next-line:max-classes-per-file
export class WebhookCommit {
  id: string;
  message: string;

  constructor(id: string, message: string) {
    this.id = id;
    this.message = message;
  }
}

// tslint:disable-next-line:max-classes-per-file
export class WebhookRepository {
  fullName: string;
}

// tslint:disable-next-line:max-classes-per-file
export class Webhook {
  gitType: GitTypeEnum;
  gitEvent: GitEventEnum;
  gitService: GitlabService | GithubService;
  commits: WebhookCommit[];
  projectId: number;
  repository: WebhookRepository;
  branchName: string;
  issue: WebhookIssue;

  constructor(
    private readonly gitlabService: GitlabService,
    private readonly githubService: GithubService,
  ) {
    this.repository = new WebhookRepository();
    this.commits = new Array<WebhookCommit>();
    this.issue = new WebhookIssue();
  }

  getAllCommits(): WebhookCommit[] {
    const commits: WebhookCommit[] = new Array();
    this.commits.forEach(c => {
      commits.push(c);
    });
    return commits;
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

  gitToWebhook(git: GitlabEvent | GithubEvent): void {
    if (isGitlabPushEvent(git)) {
      this.gitType = GitTypeEnum.Gitlab;
      this.gitEvent = GitEventEnum.Push;
      this.projectId = git.project_id;
      this.gitService = this.gitlabService;
      git.commits.forEach(c => {
        const commit = new WebhookCommit(c.id, c.message);
        this.commits.push(commit);
      });
    } else if (isGitlabBranchEvent(git)) {
      this.gitType = GitTypeEnum.Github;
      this.gitEvent = GitEventEnum.NewBranch;
      this.gitService = this.gitlabService;
      this.branchName = git.ref.substring(11);
    } else if (isGithubPushEvent(git)) {
      this.gitType = GitTypeEnum.Github;
      this.gitEvent = GitEventEnum.Push;
      this.gitService = this.githubService;
      this.repository.fullName = git.repository.full_name;
      git.commits.forEach(c => {
        const commit = new WebhookCommit(c.id, c.message);
        this.commits.push(commit);
      });
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
    } else if (isGitlabIssueEvent(git)) {
      this.gitType = GitTypeEnum.Gitlab;
      this.gitEvent = GitEventEnum.NewIssue;
      this.gitService = this.gitlabService;
      this.issue.number = git.object_attributes.iid;
      this.issue.title = git.object_attributes.title;
      this.projectId = git.object_attributes.project_id;
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

    if (this.gitType === GitTypeEnum.Gitlab) {
      gitApiInfos.projectId = this.projectId.toString();
    } else if (this.gitType === GitTypeEnum.Github) {
      gitApiInfos.repositoryFullName = this.repository.fullName;
    }

    return gitApiInfos;
  }
}
