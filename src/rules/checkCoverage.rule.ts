import { Rule } from './rule.class';
import { RuleResult } from './ruleResult';
import { GitEventEnum } from '../webhook/utils.enum';
import { Webhook } from '../webhook/webhook';
import { RuleDecorator } from './rule.decorator';
import { CommitMatches } from './commitMessage.rule';
import { HttpService } from '@nestjs/common';
import { logger } from '../logger/logger.service';
import { Utils } from './utils';

export enum CoverageProvider {
  Coveralls = 'Coveralls',
}

interface CheckCoverageOptions {
  provider: CoverageProvider;
  threshold: number;
  allowDecrease: boolean;
}

/**
 * `CheckCoverageRule` checks if coverage fulfill the options.
 * @return return a `RuleResult` object
 */
@RuleDecorator('checkCoverage')
export class CheckCoverageRule extends Rule {
  options: CheckCoverageOptions;
  events = [GitEventEnum.Cron];

  constructor(private readonly httpService: HttpService) {
    super();
  }

  async validate(
    webhook: Webhook,
    ruleConfig: CheckCoverageRule,
    ruleResults?: RuleResult[],
  ): Promise<RuleResult> {
    const ruleResult: RuleResult = new RuleResult(webhook.getGitApiInfos());

    if (typeof ruleResults === 'undefined') {
      return Promise.resolve(null);
    }

    const commit: any = ruleResults
      .map(r => r.data)
      .find(d => (d as any).commits);

    if (typeof commit !== 'undefined') {
      const commitMatches: CommitMatches[] = (commit as any).commits;
      const sha = Utils.getLastItem(commitMatches).sha;

      let coverageURL: string;

      switch (ruleConfig.options.provider.toLowerCase()) {
        case CoverageProvider.Coveralls.toLowerCase():
          coverageURL = `https://coveralls.io/builds/${sha}.json`;
          break;
      }

      try {
        const { coverage_change, covered_percent } = await this.httpService
          .get(coverageURL)
          .toPromise()
          .then(response => response.data)
          .catch(err => {
            // No coverage for this commit sha
            throw new Error(err);
          });

        if (
          (typeof ruleConfig.options.allowDecrease !== 'undefined' &&
            ruleConfig.options.allowDecrease === false &&
            coverage_change < 0) ||
          (typeof ruleConfig.options.threshold !== 'undefined' &&
            covered_percent < ruleConfig.options.threshold)
        ) {
          ruleResult.validated = false;
        } else {
          ruleResult.validated = true;
        }

        ruleResult.data = {
          coverage_change,
          covered_percent,
        };
      } catch (e) {
        // Ignore current rule
        return Promise.resolve(null);
      }
    } else {
      // Ignore current rule
      return Promise.resolve(null);
    }

    return Promise.resolve(ruleResult);
  }
}
