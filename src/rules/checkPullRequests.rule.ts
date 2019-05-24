import { Rule } from './rule.class';
import { RuleResult } from './ruleResult';
import { GitEventEnum } from '../webhook/utils.enum';
import { Webhook } from '../webhook/webhook';
import { RuleDecorator } from './rule.decorator';
import { GitIssuePRSearch, IssuePRStateEnum } from '../git/gitIssueInfos';
import { PRSearchResult } from '../git/gitPRInfos';
import { Utils } from './utils';

interface CheckPullRequestsOptions {
  updatedWithinXDays?: number;
  notUpdatedSinceXDays?: number;
  state?: string;
}

/**
 * `CheckPullRequestsRule` DESCRIPTION.
 * @return return a `RuleResult` object
 */
@RuleDecorator('checkPullRequests')
export class CheckPullRequestsRule extends Rule {
  options: CheckPullRequestsOptions;
  events = [GitEventEnum.Cron];

  async validate(
    webhook: Webhook,
    ruleConfig: CheckPullRequestsRule,
  ): Promise<RuleResult> {
    const ruleResult: RuleResult = new RuleResult(webhook.getGitApiInfos());

    const gitPRSearch: GitIssuePRSearch = new GitIssuePRSearch();
    if (typeof ruleConfig.options.state !== 'undefined') {
      if (ruleConfig.options.state.toLowerCase() === 'open') {
        gitPRSearch.state = IssuePRStateEnum.Open;
      } else if (ruleConfig.options.state.toLowerCase() === 'close') {
        gitPRSearch.state = IssuePRStateEnum.Close;
      } else if (ruleConfig.options.state.toLowerCase() === 'all') {
        gitPRSearch.state = IssuePRStateEnum.All;
      }
    }

    const pullRequests: PRSearchResult[] = await webhook.gitService.getPullRequests(
      webhook.getGitApiInfos(),
      gitPRSearch,
    );

    const PRToUpdate = pullRequests
      .filter(PR => {
        if (typeof ruleConfig.options.notUpdatedSinceXDays !== 'undefined') {
          return !Utils.checkTime(
            PR.updatedAt,
            ruleConfig.options.notUpdatedSinceXDays,
          );
        } else if (
          typeof ruleConfig.options.updatedWithinXDays !== 'undefined'
        ) {
          return Utils.checkTime(
            PR.updatedAt,
            ruleConfig.options.updatedWithinXDays,
          );
        }
      })
      .map(pr => pr.number);

    ruleResult.validated = PRToUpdate.length > 0;

    if (ruleResult.validated) {
      ruleResult.data = {
        pullRequestNumber: PRToUpdate,
      };
    } else {
      ruleResult.data = {};
    }

    return Promise.resolve(ruleResult);
  }
}
