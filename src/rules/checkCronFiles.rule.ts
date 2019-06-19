import { Rule } from './rule.class';
import { RuleResult } from './ruleResult';
import { GitEventEnum } from '../webhook/utils.enum';
import { Webhook, WebhookCommit } from '../webhook/webhook';
import { RuleDecorator } from './rule.decorator';
import { UsersOptions } from './common.interface';
import { Utils } from './utils';
import { Visitor } from 'universal-analytics';
import { Inject } from '@nestjs/common';

interface CheckCronFilesOptions {
  users?: UsersOptions;
}

/**
 * `CheckCronFilesRule` DESCRIPTION.
 * @return return a `RuleResult` object
 */
@RuleDecorator('checkCronFiles')
export class CheckCronFilesRule extends Rule {
  options: CheckCronFilesOptions;
  events = [GitEventEnum.Push];

  constructor(
    @Inject('GoogleAnalytics')
    private readonly googleAnalytics: Visitor,
  ) {
    super();
  }

  async validate(
    webhook: Webhook,
    ruleConfig: CheckCronFilesRule,
  ): Promise<RuleResult> {
    const ruleResult: RuleResult = new RuleResult(
      webhook.getGitApiInfos(),
      webhook.getCloneURL(),
    );

    this.googleAnalytics
      .event('Rule', 'CheckCronFiles', webhook.getCloneURL())
      .send();

    // First, check if rule need to be processed
    if (
      typeof ruleConfig.options !== 'undefined' &&
      !Utils.checkUser(webhook, ruleConfig.options.users)
    ) {
      return null;
    }

    const commits: WebhookCommit[] = webhook.getAllCommits();
    let validated: boolean = false;
    const allAddedCronFiles: string[] = commits
      .flatMap(c => {
        if (c.added !== undefined) {
          return c.added.map(a => {
            if (a.match('^\\.hygie/cron-.*\\.rulesrc$')) {
              validated = true;
              return a;
            }
          });
        }
      })
      .flat(20) // maximal number of commits in a PUSH
      .filter(elt => {
        return elt !== undefined;
      });
    const allUpdatedCronFiles: string[] = commits
      .flatMap(c => {
        if (c.modified !== undefined) {
          return c.modified.map(a => {
            if (a.match('^\\.hygie/cron-.*\\.rulesrc$')) {
              validated = true;
              return a;
            }
          });
        }
      })
      .flat(20) // maximal number of commits in a PUSH
      .filter(elt => {
        return elt !== undefined;
      });
    const allRemovedCronFiles: string[] = commits
      .flatMap(c => {
        if (c.removed !== undefined) {
          return c.removed.map(a => {
            if (a.match('^\\.hygie/cron-.*\\.rulesrc$')) {
              validated = true;
              return a;
            }
          });
        }
      })
      .flat(20) // maximal number of commits in a PUSH
      .filter(elt => {
        return elt !== undefined;
      });

    ruleResult.validated = validated;
    ruleResult.data = {
      cron: {
        added: allAddedCronFiles,
        updated: allUpdatedCronFiles,
        removed: allRemovedCronFiles,
      },
    };

    return Promise.resolve(ruleResult);
  }
}
