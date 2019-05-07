import { Rule } from './rule.class';
import { GitEventEnum, CommitStatusEnum } from '../webhook/utils.enum';
import { WebhookCommit, Webhook } from '../webhook/webhook';
import { RuleResult } from './ruleResult';
import { RuleDecorator } from './rule.decorator';

interface CommitMessageOptions {
  regexp: string;
  maxLength: number;
  branches: BranchesOptions;
}

interface BranchesOptions {
  only: string[];
  ignore: string[];
}

export class CommitMatches {
  sha: string;
  message: string;
  matches: string[];
  status: CommitStatusEnum;
  success: boolean;
}

/**
 * `CommitMessageRule` checks all commits title according to a regular expression and an optional max size.
 * @return return a `RuleResult` object
 */
@RuleDecorator('commitMessage')
export class CommitMessageRule extends Rule {
  options: CommitMessageOptions;

  events = [GitEventEnum.Push];

  async validate(
    webhook: Webhook,
    ruleConfig: CommitMessageRule,
  ): Promise<RuleResult> {
    const ruleResult: RuleResult = new RuleResult(webhook.getGitApiInfos());
    const commits: WebhookCommit[] = webhook.getAllCommits();
    const commitRegExp = RegExp(ruleConfig.options.regexp);
    const branchName = webhook.getBranchName();

    // First, check if rule need to be processed
    if (typeof ruleConfig.options.branches !== 'undefined') {
      const ignore: string[] = ruleConfig.options.branches.ignore;
      const only: string[] = ruleConfig.options.branches.only;
      if (typeof ignore !== 'undefined') {
        if (ignore.find(i => i === branchName)) {
          return null;
        }
      }
      if (typeof only !== 'undefined') {
        if (!only.find(o => o === branchName)) {
          return null;
        }
      }
    }

    const commitsMatches: CommitMatches[] = new Array();
    let commitMatches: CommitMatches;

    let allRegExpSuccessed: boolean = true;
    let regexpSuccessed: boolean = false;

    commits.forEach(c => {
      commitMatches = new CommitMatches();

      regexpSuccessed =
        commitRegExp.test(c.message) &&
        (ruleConfig.options.maxLength !== undefined
          ? c.message.length <= ruleConfig.options.maxLength
          : true);

      if (regexpSuccessed) {
        commitMatches.status = CommitStatusEnum.Success;
        commitMatches.success = true;
      } else {
        commitMatches.status = CommitStatusEnum.Failure;
        allRegExpSuccessed = false;
        commitMatches.success = false;
      }

      commitMatches.sha = c.sha;
      commitMatches.message = c.message;
      commitMatches.matches = c.message.match(commitRegExp);

      commitsMatches.push(commitMatches);
    });

    ruleResult.validated = allRegExpSuccessed;
    ruleResult.data = {
      branch: webhook.getBranchName(),
      commits: commitsMatches,
    };
    return Promise.resolve(ruleResult);
  }
}
