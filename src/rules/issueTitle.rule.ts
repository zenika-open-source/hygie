import { Rule } from './rule.class';
import { RuleResult } from './ruleResult';
import { GitEventEnum } from '../webhook/utils.enum';
import { Webhook } from '../webhook/webhook';
import { RuleDecorator } from './rule.decorator';
import { UsersOptions } from './common.interface';
import { Utils } from './utils';
import { Inject } from '@nestjs/common';
import { Visitor } from 'universal-analytics';

interface IssueTitleOptions {
  regexp: string;
  users?: UsersOptions;
}

/**
 * `IssueTitleRule` checks the issue's title according to a regular expression.
 * @return return a `RuleResult` object
 */
@RuleDecorator('issueTitle')
export class IssueTitleRule extends Rule {
  options: IssueTitleOptions;
  events = [GitEventEnum.NewIssue];

  constructor(
    @Inject('GoogleAnalytics')
    private readonly googleAnalytics: Visitor,
  ) {
    super();
  }

  async validate(
    webhook: Webhook,
    ruleConfig: IssueTitleRule,
    ruleResults?: RuleResult[],
  ): Promise<RuleResult> {
    const ruleResult: RuleResult = new RuleResult(
      webhook.getGitApiInfos(),
      webhook.getCloneURL(),
    );
    const titleIssue = webhook.getIssueTitle();
    const issueRegExp = RegExp(ruleConfig.options.regexp);

    this.googleAnalytics
      .event('Rule', 'issueTitle', webhook.getCloneURL())
      .send();

    // First, check if rule need to be processed
    if (!Utils.checkUser(webhook, ruleConfig.options.users)) {
      return null;
    }

    ruleResult.validated = issueRegExp.test(titleIssue);

    ruleResult.data = {
      issue: {
        title: titleIssue,
        number: webhook.getIssueNumber(),
        description: webhook.getIssueDescription(),
        matches: titleIssue.match(issueRegExp),
      },
    };
    return ruleResult;
  }
}
