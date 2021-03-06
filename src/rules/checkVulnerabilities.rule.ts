import { Rule } from './rule.class';
import { RuleResult } from './ruleResult';
import { GitEventEnum } from '../webhook/utils.enum';
import { Webhook } from '../webhook/webhook';
import { RuleDecorator } from './rule.decorator';
import { RemoteConfigUtils } from '../remote-config/utils';
import { Logger } from '@nestjs/common';
import { AnalyticsDecorator } from '../analytics/analytics.decorator';
import { HYGIE_TYPE } from '../utils/enum';

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
  events = [GitEventEnum.Push, GitEventEnum.Cron];

  getNumberOfVulnerabilities(data: any): number {
    const vulnerabilities = data.metadata.vulnerabilities;
    return (
      vulnerabilities.info +
      vulnerabilities.low +
      vulnerabilities.moderate +
      vulnerabilities.high +
      vulnerabilities.critical
    );
  }

  @AnalyticsDecorator(HYGIE_TYPE.RULE)
  async validate(
    webhook: Webhook,
    ruleConfig: CheckVulnerabilitiesRule,
    ruleResults?: RuleResult[],
  ): Promise<RuleResult> {
    const ruleResult: RuleResult = new RuleResult(webhook);

    const execa = require('execa');
    const download = require('download');
    const fs = require('fs-extra');

    let audit: any;

    let packageUrl: string;
    let packageLockUrl: string;

    if (
      typeof ruleConfig.options !== 'undefined' &&
      typeof ruleConfig.options.packageUrl !== 'undefined' &&
      typeof ruleConfig.options.packageLockUrl !== 'undefined'
    ) {
      packageUrl = ruleConfig.options.packageUrl;
      packageLockUrl = ruleConfig.options.packageLockUrl;
    } else {
      packageUrl = RemoteConfigUtils.getGitRawPath(
        webhook.getGitType(),
        webhook.getCloneURL(),
        'package.json',
      );
      packageLockUrl = RemoteConfigUtils.getGitRawPath(
        webhook.getGitType(),
        webhook.getCloneURL(),
        'package-lock.json',
      );
    }

    await Promise.all([
      download(packageUrl, `packages/${webhook.getRemoteDirectory()}`),
      download(packageLockUrl, `packages/${webhook.getRemoteDirectory()}`),
    ]);

    try {
      audit = execa.shellSync(
        `cd packages/${webhook.getRemoteDirectory()} & npm audit --json`,
      );

      ruleResult.data.vulnerabilities = JSON.parse(audit.stdout);
      ruleResult.validated = true;
    } catch (e) {
      const data = JSON.parse(e.stdout);
      ruleResult.data.number = this.getNumberOfVulnerabilities(data);
      ruleResult.data.vulnerabilities = JSON.stringify(data);
      ruleResult.validated = false;
    }

    // Delete folder
    fs.remove(`packages/${webhook.getRemoteDirectory().split('/')[0]}`).catch(
      err => {
        Logger.error(err, 'checkVulnerabilities');
      },
    );

    return ruleResult;
  }
}
