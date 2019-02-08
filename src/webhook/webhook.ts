import {
  GitTypeEnum,
  isGitlabPushEvent,
  isGithubPushEvent,
  GitEventEnum,
  CommitStatusEnum,
  isGithubBranchEvent,
  isGitlabBranchEvent,
} from './utils.enum';
import { GitlabService } from 'src/gitlab/gitlab.service';
import { GithubService } from 'src/github/github.service';
import { CommitStatusInfos } from './commitStatusInfos';
import { GitlabEvent } from 'src/gitlab/gitlabEvent';
import { GithubEvent } from 'src/github/githubEvent';

export class WebhookCommit {
  message: string;
  id: string;
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
    this.commits.push(new WebhookCommit());
  }

  getCommitMessage(): string {
    return this.commits[0].message;
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
      this.commits[0].id = git.commits[0].id;
      this.commits[0].message = git.commits[0].message;
    } else if (isGitlabBranchEvent(git)) {
      this.gitType = GitTypeEnum.Github;
      this.gitEvent = GitEventEnum.NewBranch;
      this.branchName = git.ref.substring(11);
    } else if (isGithubPushEvent(git)) {
      this.gitType = GitTypeEnum.Github;
      this.gitEvent = GitEventEnum.Push;
      this.gitService = this.githubService;
      this.repository.fullName = git.repository.full_name;
      this.commits[0].id = git.commits[0].id;
      this.commits[0].message = git.commits[0].message;
    } else if (isGithubBranchEvent(git)) {
      this.gitType = GitTypeEnum.Github;
      this.gitEvent = GitEventEnum.NewBranch;
      this.branchName = git.ref;
    }
  }

  gitCommitStatusInfos(commitStatus: CommitStatusEnum): CommitStatusInfos {
    const commitStatusInfos = new CommitStatusInfos();
    commitStatusInfos.commitStatus = commitStatus;
    commitStatusInfos.commitSha = this.commits[0].id;
    commitStatusInfos.descriptionMessage = 'my message';

    if (this.gitType === GitTypeEnum.Gitlab) {
      commitStatusInfos.projectId = this.projectId.toString();
    } else if (this.gitType === GitTypeEnum.Github) {
      commitStatusInfos.repositoryFullName = this.repository.fullName;
    }

    return commitStatusInfos;
  }
}
