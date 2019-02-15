import {
  GitTypeEnum,
  isGitlabPushEvent,
  isGithubPushEvent,
  GitEventEnum,
  CommitStatusEnum,
  isGithubBranchEvent,
  isGitlabBranchEvent,
} from './utils.enum';
import { GitlabService } from '../gitlab/gitlab.service';
import { GithubService } from '../github/github.service';
import { CommitStatusInfos } from './commitStatusInfos';
import { GitlabEvent } from '../gitlab/gitlabEvent';
import { GithubEvent } from '../github/githubEvent';

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

  constructor(
    private readonly gitlabService: GitlabService,
    private readonly githubService: GithubService,
  ) {
    this.repository = new WebhookRepository();
    this.commits = new Array<WebhookCommit>();
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
      this.branchName = git.ref;
    }
  }

  gitCommitStatusInfos(
    commitStatus: CommitStatusEnum,
    commitId: string,
  ): CommitStatusInfos {
    const commitStatusInfos = new CommitStatusInfos();
    commitStatusInfos.commitStatus = commitStatus;
    commitStatusInfos.commitSha = commitId;

    if (this.gitType === GitTypeEnum.Gitlab) {
      commitStatusInfos.projectId = this.projectId.toString();
    } else if (this.gitType === GitTypeEnum.Github) {
      commitStatusInfos.repositoryFullName = this.repository.fullName;
    }

    return commitStatusInfos;
  }
}
