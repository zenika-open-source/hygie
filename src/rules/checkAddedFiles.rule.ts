import { Rule } from './rule.class';
import { RuleResult } from './ruleResult';
import { GitEventEnum } from '../webhook/utils.enum';
import { Webhook, WebhookCommit } from '../webhook/webhook';
import { RuleDecorator } from './rule.decorator';
import 'array-flat-polyfill';

interface CheckAddedFilesOptions {
  regexp: string;
}

/**
 * `CheckAddedFilesRule` checks all added filenames in commits according to a regular expression.
 * @return return a `RuleResult` object
 */
@RuleDecorator('checkAddedFiles')
export class CheckAddedFilesRule extends Rule {
  options: CheckAddedFilesOptions;
  events = [GitEventEnum.Push];

  async validate(
    webhook: Webhook,
    ruleConfig: CheckAddedFilesRule,
  ): Promise<RuleResult> {
    const ruleResult: RuleResult = new RuleResult(webhook.getGitApiInfos());
    const commits: WebhookCommit[] = webhook.getAllCommits();
    const addedRegExp = RegExp(ruleConfig.options.regexp);

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
    ruleResult.data = {
      addedFiles: allMatchingAddedFiles,
    };

    return Promise.resolve(ruleResult);
  }
}
