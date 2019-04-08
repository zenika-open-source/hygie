import { Rule } from './rule.class';
import { RuleResult } from './ruleResult';
import { GitEventEnum } from '../webhook/utils.enum';
import { Webhook } from '../webhook/webhook';
import { RuleDecorator } from './rule.decorator';
import { logger } from '../logger/logger.service';

interface CheckVulnerabilitiesOptions {
  packageUrl: string;
  packageLockUrl: string;
}

/**
 * `CheckVulnerabilitiesRule` will check if `package.json` and `package-lock.json` contain vulnerabilities thank's to `npm audit`.
 * @return return a `RuleResult` object
 */
@RuleDecorator('checkVulnerabilities')
export class CheckVulnerabilitiesRule extends Rule {
  options: CheckVulnerabilitiesOptions;
  events = [GitEventEnum.Push];

  async validate(
    webhook: Webhook,
    ruleConfig: CheckVulnerabilitiesRule,
  ): Promise<RuleResult> {
    const ruleResult: RuleResult = new RuleResult(webhook.getGitApiInfos());

    const execa = require('execa');
    const download = require('download');

    let audit: any;

    await Promise.all([
      download(
        ruleConfig.options.packageUrl,
        `packages/${webhook.getRemoteDirectory()}`,
      ),
      download(
        ruleConfig.options.packageLockUrl,
        `packages/${webhook.getRemoteDirectory()}`,
      ),
    ]);

    try {
      audit = execa.shellSync(
        `cd packages/${webhook.getRemoteDirectory()} & npm audit --json`,
      );
      ruleResult.data = {
        vulnerabilities: JSON.parse(audit.stdout),
      };
      ruleResult.validated = true;
    } catch (e) {
      ruleResult.data = {
        vulnerabilities: JSON.parse(e.stdout),
      };
      ruleResult.validated = false;
    }

    // Delete folder
    // DO NOT WORK ON WINDOWS
    // UNCOMMENT IT IN A LINUX ENV
    /*execa.shellSync(
      `rm -rf packages/${webhook.getRemoteDirectory().split('/')[0]}`,
    );*/

    return ruleResult;
  }
}
