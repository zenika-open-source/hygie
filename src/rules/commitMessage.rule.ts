import { Rule } from './rule.class';
import { CommitStatusEnum, GitEventEnum } from '../webhook/utils.enum';
import { WebhookCommit, Webhook } from '../webhook/webhook';
import { RuleResult } from './ruleResult';

interface CommitMessageOptions {
  regexp: string;
}

export class CommitMatches {
  sha: string;
  message: string;
  matches: string[];
}

export class CommitMessageRule extends Rule {
  name = 'commitMessage';
  options: CommitMessageOptions;

  constructor(webhook: Webhook) {
    super(webhook);
    this.events = new Array();
    this.events.push(GitEventEnum.Push);
  }

  validate(): RuleResult {
    const ruleResult: RuleResult = new RuleResult();
    const commits: WebhookCommit[] = this.webhook.getAllCommits();
    const commitRegExp = RegExp(this.options.regexp);

    const commitsMatches: CommitMatches[] = new Array();
    let commitMatches: CommitMatches;

    let allRegExpSuccessed: boolean = true;
    let regexpSuccessed: boolean = false;
    let commitStatus: CommitStatusEnum;
    commits.forEach(c => {
      commitMatches = new CommitMatches();
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
    ruleResult.data = {
      branch: this.webhook.getBranchName(),
      commits: commitsMatches,
    };
    return ruleResult;
  }
}
