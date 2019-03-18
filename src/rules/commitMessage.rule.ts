import { Rule } from './rule.class';
import { GitEventEnum, CommitStatusEnum } from '../webhook/utils.enum';
import { WebhookCommit, Webhook } from '../webhook/webhook';
import { RuleResult } from './ruleResult';
import { RuleDecorator } from './rule.decorator';

interface CommitMessageOptions {
  regexp: string;
}

export class CommitMatches {
  sha: string;
  message: string;
  matches: string[];
  status: CommitStatusEnum;
  success: boolean;
}

/**
 * `CommitMessageRule` check all commits title according to a regular expression
 * @return return a `RuleResult` object
 */
@RuleDecorator('commitMessage')
export class CommitMessageRule extends Rule {
  options: CommitMessageOptions;

  events = [GitEventEnum.Push];

  validate(webhook: Webhook, ruleConfig: CommitMessageRule): RuleResult {
    const ruleResult: RuleResult = new RuleResult(webhook.getGitApiInfos());
    const commits: WebhookCommit[] = webhook.getAllCommits();
    const commitRegExp = RegExp(ruleConfig.options.regexp);

    const commitsMatches: CommitMatches[] = new Array();
    let commitMatches: CommitMatches;

    let allRegExpSuccessed: boolean = true;
    let regexpSuccessed: boolean = false;

    commits.forEach(c => {
      commitMatches = new CommitMatches();
      regexpSuccessed = commitRegExp.test(c.message);

      if (regexpSuccessed) {
        commitMatches.status = CommitStatusEnum.Success;
        commitMatches.success = true;
      } else {
        commitMatches.status = CommitStatusEnum.Failure;
        allRegExpSuccessed = false;
        commitMatches.success = false;
      }

      commitMatches.sha = c.id;
      commitMatches.message = c.message;
      commitMatches.matches = c.message.match(commitRegExp);

      commitsMatches.push(commitMatches);
    });

    ruleResult.validated = allRegExpSuccessed;
    ruleResult.data = {
      branch: webhook.getBranchName(),
      commits: commitsMatches,
    };
    return ruleResult;
  }
}
