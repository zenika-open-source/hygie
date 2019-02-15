import { Rule } from './rule.class';
import { CommitStatusEnum } from '../webhook/utils.enum';
import { WebhookCommit } from '../webhook/webhook';

interface CommitMessageOptions {
  regexp: string;
}

export class CommitMessageRule extends Rule {
  options: CommitMessageOptions;

  validate(): boolean {
    const commits: WebhookCommit[] = this.webhook.getAllCommits();
    const commitRegExp = RegExp(this.options.regexp);

    let allRegExpSuccessed: boolean = true;
    let regexpSuccessed: boolean = false;
    let commitStatus: CommitStatusEnum;
    commits.forEach(c => {
      regexpSuccessed = commitRegExp.test(c.message);

      if (regexpSuccessed) {
        commitStatus = CommitStatusEnum.Success;
      } else {
        commitStatus = CommitStatusEnum.Failure;
        allRegExpSuccessed = false;
      }

      this.webhook.gitService.updateCommitStatus(
        this.webhook.gitCommitStatusInfos(commitStatus, c.id),
      );
    });

    return this.excecuteValidationFunctions(allRegExpSuccessed);
  }
}
