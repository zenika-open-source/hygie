import { Rule } from './rule.class';
import { CommitStatusEnum } from '../webhook/utils.enum';
import { WebhookCommit } from '../webhook/webhook';
import { RuleResult } from './ruleResult';

interface CommitMessageOptions {
  regexp: string;
}

export class CommitMatches {
  sha: string;
  message: string;
  matches: string[];
}

// tslint:disable-next-line:max-classes-per-file
export class CommitMessageRule extends Rule {
  options: CommitMessageOptions;

  validate(): RuleResult {
    const ruleResult: RuleResult = new RuleResult();
    const commits: WebhookCommit[] = this.webhook.getAllCommits();
    const commitRegExp = RegExp(this.options.regexp);

    const commitsMatches: CommitMatches[] = new Array();
    const commitMatches: CommitMatches = new CommitMatches();

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

      commitMatches.sha = c.id;
      commitMatches.message = c.message;
      commitMatches.matches = c.message.match(commitRegExp);

      commitsMatches.push(commitMatches);

      this.webhook.gitService.updateCommitStatus(
        this.webhook.getGitApiInfos(),
        this.webhook.getGitCommitStatusInfos(commitStatus, c.id),
      );
    });

    ruleResult.validated = allRegExpSuccessed;
    ruleResult.data = commitsMatches;
    return ruleResult;
  }
}
