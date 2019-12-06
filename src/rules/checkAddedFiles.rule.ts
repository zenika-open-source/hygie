import { Rule } from './rule.class';
import { RuleResult } from './ruleResult';
import { GitEventEnum } from '../webhook/utils.enum';
import { Webhook, WebhookCommit } from '../webhook/webhook';
import { RuleDecorator } from './rule.decorator';
import 'array-flat-polyfill';
import { UsersOptions } from './common.interface';
import { Utils } from './utils';
import { Visitor } from 'universal-analytics';
import { Inject } from '@nestjs/common';

interface CheckAddedFilesOptions {
  regexp: string;
  users?: UsersOptions;
}

/**
 * `CheckAddedFilesRule` checks all added filenames in commits according to a regular expression.
 * @return return a `RuleResult` object
 */
@RuleDecorator('checkAddedFiles')
export class CheckAddedFilesRule extends Rule {
  options: CheckAddedFilesOptions;
  events = [GitEventEnum.Push];

  constructor(
    @Inject('GoogleAnalytics')
    private readonly googleAnalytics: Visitor,
  ) {
    super();
  }

  async validate(
    webhook: Webhook,
    ruleConfig: CheckAddedFilesRule,
    ruleResults?: RuleResult[],
  ): Promise<RuleResult> {
    const ruleResult: RuleResult = new RuleResult(webhook);
    const commits: WebhookCommit[] = webhook.getAllCommits();
    const addedRegExp = RegExp(ruleConfig.options.regexp);

    this.googleAnalytics
      .event('Rule', 'checkAddedFiles', webhook.getCloneURL())
      .send();

    // First, check if rule need to be processed
    if (!Utils.checkUser(webhook, ruleConfig.options.users)) {
      return null;
    }

    const allMatchingAddedFiles: string[] = commits
      .flatMap(c => {
        if (c.added !== undefined) {
          return c.added.map(a => {
            if (a.match(addedRegExp)) {
              return a;
            }
          });
        }
      })
      .flat(20) // maximal number of commits in a PUSH
      .filter(elt => {
        return elt !== undefined;
      });

    ruleResult.validated = allMatchingAddedFiles.length > 0;
    ruleResult.data.addedFiles = allMatchingAddedFiles;

    return ruleResult;
  }
}
