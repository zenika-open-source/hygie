import { Rule } from './rule.class';
import { logger } from '../logger/logger.service';
import { CommitStatusEnum } from '../webhook/utils.enum';

interface CommitMessageOptions {
  regexp: string;
}

export class CommitMessageRule extends Rule {
  options: CommitMessageOptions;

  validate(): boolean {
    const commitMessage = this.webhook.getCommitMessage();
    const commitRegExp = RegExp(this.options.regexp);

    logger.info('commitMessage:' + commitMessage);
    logger.info('commitRegExp:' + this.options.regexp);

    const ruleSuccessed: boolean = commitRegExp.test(commitMessage);
    const commitStatus = ruleSuccessed
      ? CommitStatusEnum.Success
      : CommitStatusEnum.Failure;

    this.webhook.gitService.updateCommitStatus(
      this.webhook.gitCommitStatusInfos(commitStatus),
    );

    return this.excecuteValidationFunctions(ruleSuccessed);
  }
}
