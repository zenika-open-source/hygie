import { Rule } from './rule.class';
import { RuleResult } from './ruleResult';
import { GitEventEnum } from '../webhook/utils.enum';
import { Injectable } from '@nestjs/common';

interface IssueTitleOptions {
  regexp: string;
}

@Injectable()
export class IssueTitleRule extends Rule {
  name = 'issueTitle';
  options: IssueTitleOptions;
  events = [GitEventEnum.NewIssue];

  validate(webhook, ruleConfig): RuleResult {
    const ruleResult: RuleResult = new RuleResult(webhook.getGitApiInfos());
    const titleIssue = webhook.getIssueTitle();
    const issueRegExp = RegExp(ruleConfig.options.regexp);
    ruleResult.validated = issueRegExp.test(titleIssue);

    ruleResult.data = {
      issueTitle: titleIssue,
      issueNumber: webhook.getIssueNumber(),
    };
    return ruleResult;
  }
}
