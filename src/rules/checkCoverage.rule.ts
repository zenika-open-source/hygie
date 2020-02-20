import { Rule } from './rule.class';
import { RuleResult } from './ruleResult';
import { GitEventEnum } from '../webhook/utils.enum';
import { Webhook } from '../webhook/webhook';
import { RuleDecorator } from './rule.decorator';
import { HttpService, Logger } from '@nestjs/common';
import { GitBranchCommit } from '../git/gitBranchSha';
import { AnalyticsDecorator } from '../analytics/analytics.decorator';
import { HYGIE_TYPE } from '../utils/enum';

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

  @AnalyticsDecorator(HYGIE_TYPE.RULE)
  async validate(
    webhook: Webhook,
    ruleConfig: CheckCoverageRule,
    ruleResults?: RuleResult[],
  ): Promise<RuleResult> {
    const ruleResult: RuleResult = new RuleResult(webhook);
    ruleResult.data = { coverage: [] };
    let allBranchesPassed: boolean = true;
    let coverageURL: string;

    const lastBranchesCommitSha: GitBranchCommit[] = await webhook.gitService.getLastBranchesCommitSha();

    for (let index = 0; index < lastBranchesCommitSha.length; index++) {
      const sha: string = lastBranchesCommitSha[index].commitSha;
      const branch: string = lastBranchesCommitSha[index].branch;

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
          .catch(() => {
            throw new Error('No coverage for this commit sha');
          });

        if (
          (typeof ruleConfig.options.allowDecrease !== 'undefined' &&
            ruleConfig.options.allowDecrease === false &&
            coverage_change < 0) ||
          (typeof ruleConfig.options.threshold !== 'undefined' &&
            covered_percent < ruleConfig.options.threshold)
        ) {
          allBranchesPassed = false;
        }

        (ruleResult.data as any).coverage.push({
          branch,
          coverage_change,
          covered_percent,
        });
      } catch (e) {
        Logger.error(e);
      }
    }

    ruleResult.validated = allBranchesPassed;

    return ruleResult;
  }
}
