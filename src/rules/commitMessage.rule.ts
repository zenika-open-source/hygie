import { Rule } from './rule.class';
import { CommitStatusEnum, GitEventEnum } from '../webhook/utils.enum';
import { WebhookCommit, Webhook } from '../webhook/webhook';
import { RuleResult } from './ruleResult';
import { Injectable } from '@nestjs/common';

interface CommitMessageOptions {
  regexp: string;
}

export class CommitMatches {
  sha: string;
  message: string;
  matches: string[];
}

@Injectable()
export class CommitMessageRule extends Rule {
  name = 'commitMessage';
  options: CommitMessageOptions;

  events = [GitEventEnum.Push];

  validate(webhook: Webhook, ruleConfig): RuleResult {
    const ruleResult: RuleResult = new RuleResult(webhook.getGitApiInfos());
    const commits: WebhookCommit[] = webhook.getAllCommits();
    const commitRegExp = RegExp(ruleConfig.options.regexp);

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

      webhook.gitService.updateCommitStatus(
        webhook.getGitApiInfos(),
        webhook.getGitCommitStatusInfos(commitStatus, c.id),
      );
    });

    ruleResult.validated = allRegExpSuccessed;
    ruleResult.data = {
      branch: webhook.getBranchName(),
      commits: commitsMatches,
    };
    return ruleResult;
  }
}
