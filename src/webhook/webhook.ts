import {
  GitTypeEnum,
  isGitlabPushEvent,
  isGithubPushEvent,
  GitEventEnum,
  CommitStatusEnum,
} from './utils.enum';
import { GitlabService } from 'src/gitlab/gitlab.service';
import { GithubService } from 'src/github/github.service';
import { GitlabPushEvent } from 'src/gitlab/gitlabPushEvent';
import { GithubPushEvent } from 'src/github/githubPushEvent';
import { CommitStatusInfos } from './commitStatusInfos';

export class WebhookCommit {
  message: string;
  id: string;
}

// tslint:disable-next-line:max-classes-per-file
export class WebhookRepository {
  // tslint:disable-next-line:variable-name
  full_name: string;
}

// tslint:disable-next-line:max-classes-per-file
export class Webhook {
  gitType: GitTypeEnum;
  gitService: GitlabService | GithubService;
  commits: WebhookCommit[];
  // tslint:disable-next-line:variable-name
  project_id: number;
  repository: WebhookRepository;

  constructor(
    private readonly gitlabService: GitlabService,
    private readonly githubService: GithubService,
  ) {
    this.repository = new WebhookRepository();
    this.commits = new Array<WebhookCommit>();
    this.commits.push(new WebhookCommit());
  }

  gitToWebhook(git: GitlabPushEvent | GithubPushEvent): void {
    if (isGitlabPushEvent(git)) {
      this.gitType = GitTypeEnum.Gitlab;
      this.project_id = git.project_id;
      this.gitService = this.gitlabService;
    } else if (isGithubPushEvent(git)) {
      this.gitType = GitTypeEnum.Github;
      this.gitService = this.githubService;
      this.repository.full_name = git.repository.full_name;
    }

    this.commits[0].id = git.commits[0].id;
    this.commits[0].message = git.commits[0].message;
  }

  gitCommitStatusInfos(commitStatus: CommitStatusEnum): CommitStatusInfos {
    const commitStatusInfos = new CommitStatusInfos();
    commitStatusInfos.commitStatus = commitStatus;
    commitStatusInfos.commitSha = this.commits[0].id;
    commitStatusInfos.descriptionMessage = 'my message';

    if (this.gitType === GitTypeEnum.Gitlab) {
      commitStatusInfos.projectId = this.project_id.toString();
    } else if (this.gitType === GitTypeEnum.Github) {
      commitStatusInfos.repositoryFullName = this.repository.full_name;
    }

    return commitStatusInfos;
  }
}
