import { Rule } from './rule.class';
import { GitEventEnum, CommitStatusEnum } from '../webhook/utils.enum';
import { WebhookCommit, Webhook } from '../webhook/webhook';
import { RuleResult } from './ruleResult';
import { RuleDecorator } from './rule.decorator';
import { BranchesOptions, UsersOptions } from './common.interface';
import { Utils } from './utils';
import { Inject } from '@nestjs/common';
import { Visitor } from 'universal-analytics';
import { logger } from '../logger/logger.service';

interface CommitMessageOptions {
  regexp: string;
  users?: UsersOptions;
  maxLength?: number;
  branches?: BranchesOptions;
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

  constructor(
    @Inject('GoogleAnalytics')
    private readonly googleAnalytics: Visitor,
  ) {
    super();
  }

  async validate(
    webhook: Webhook,
    ruleConfig: CommitMessageRule,
    ruleResults?: RuleResult[],
  ): Promise<RuleResult> {
    const ruleResult: RuleResult = new RuleResult(webhook.getGitApiInfos());
    const commits: WebhookCommit[] = webhook.getAllCommits();
    if (commits.length === 0) {
      return null;
    }
    const commitRegExp = RegExp(ruleConfig.options.regexp);

    this.googleAnalytics
      .event('Rule', 'commitMessage', webhook.getCloneURL())
      .send();

    // First, check if rule need to be processed
    if (
      !Utils.checkUser(webhook, ruleConfig.options.users) ||
      !Utils.checkBranch(webhook, ruleConfig.options.branches)
    ) {
      return null;
    }

    const commitsMatches: CommitMatches[] = new Array();
    let commitMatches: CommitMatches;

    let allRegExpSuccessed: boolean = true;
    let regexpSuccessed: boolean = false;

    commits.forEach(c => {
      commitMatches = new CommitMatches();

      // Git commit message, not commit description nor footer
      const commitMessage: string = c.message.split('\n')[0];

      regexpSuccessed =
        commitRegExp.test(commitMessage) &&
        (ruleConfig.options.maxLength !== undefined
          ? commitMessage.length <= ruleConfig.options.maxLength
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
      commitMatches.message = commitMessage;
      commitMatches.matches = commitMessage.match(commitRegExp);

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
