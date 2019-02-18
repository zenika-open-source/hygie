import { Rule } from './rule.class';
import { CommitStatusEnum } from '../webhook/utils.enum';
import { WebhookCommit } from '../webhook/webhook';
import { logger } from '../logger/logger.service';

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

      /*logger.info(
        c.message.replace(commitRegExp, 'Object: $1\nScope: $2\nIssue: $3'),
      );*/

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

    return allRegExpSuccessed;
  }
}
