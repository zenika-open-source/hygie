import { Rule } from './rule.class';
import { RuleResult } from './ruleResult';
import { GitEventEnum } from '../webhook/utils.enum';
import { Webhook } from '../webhook/webhook';
import { RuleDecorator } from './rule.decorator';
import {
  GitIssuePRSearch,
  IssuePRStateEnum,
  IssueSearchResult,
} from '../git/gitIssueInfos';
import { Utils } from './utils';

interface CheckIssuesOptions {
  updatedWithinXDays?: number;
  notUpdatedSinceXDays?: number;
  state?: string;
}

/**
 * `checkIssues` will return all Issues matching the filters options.
 * @return return a `RuleResult` object with all matching issues
 */
@RuleDecorator('checkIssues')
export class CheckIssuesRule extends Rule {
  options: CheckIssuesOptions;
  events = [GitEventEnum.Cron];

  async validate(
    webhook: Webhook,
    ruleConfig: CheckIssuesRule,
  ): Promise<RuleResult> {
    const ruleResult: RuleResult = new RuleResult(webhook.getGitApiInfos());

    const gitIssueSearch: GitIssuePRSearch = new GitIssuePRSearch();
    if (typeof ruleConfig.options.state !== 'undefined') {
      if (ruleConfig.options.state.toLowerCase() === 'open') {
        gitIssueSearch.state = IssuePRStateEnum.Open;
      } else if (ruleConfig.options.state.toLowerCase() === 'close') {
        gitIssueSearch.state = IssuePRStateEnum.Close;
      } else if (ruleConfig.options.state.toLowerCase() === 'all') {
        gitIssueSearch.state = IssuePRStateEnum.All;
      }
    }

    const issues: IssueSearchResult[] = await webhook.gitService.getIssues(
      webhook.getGitApiInfos(),
      gitIssueSearch,
    );

    const issuesToUpdate = issues
      .filter(issue => {
        if (typeof ruleConfig.options.notUpdatedSinceXDays !== 'undefined') {
          return !Utils.checkTime(
            issue.updatedAt,
            ruleConfig.options.notUpdatedSinceXDays,
          );
        } else if (
          typeof ruleConfig.options.updatedWithinXDays !== 'undefined'
        ) {
          return Utils.checkTime(
            issue.updatedAt,
            ruleConfig.options.updatedWithinXDays,
          );
        }
      })
      .map(issue => issue.number);

    ruleResult.validated = issuesToUpdate.length > 0;

    if (ruleResult.validated) {
      ruleResult.data = {
        issueNumber: issuesToUpdate,
      };
    } else {
      ruleResult.data = {};
    }

    return Promise.resolve(ruleResult);
  }
}
