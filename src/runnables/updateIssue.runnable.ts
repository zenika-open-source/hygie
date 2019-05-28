import { Runnable } from './runnable.class';
import { RuleResult } from '../rules/ruleResult';
import { CallbackType } from './runnables.service';
import { RunnableDecorator } from './runnable.decorator';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { GitApiInfos } from '../git/gitApiInfos';
import { GitTypeEnum } from '../webhook/utils.enum';
import { IssuePRStateEnum, GitIssueInfos } from '../git/gitIssueInfos';

interface UpdateIssueArgs {
  state: string;
  labels: string[];
}

/**
 * `UpdateIssueRunnable` update some issue's properties.
 *  @warn Be sure that the rule returned the `issueNumber` property in the `RuleResult` object.
 */
@RunnableDecorator('UpdateIssueRunnable')
export class UpdateIssueRunnable extends Runnable {
  constructor(
    private readonly githubService: GithubService,
    private readonly gitlabService: GitlabService,
  ) {
    super();
  }

  async run(
    callbackType: CallbackType,
    ruleResult: RuleResult,
    args: UpdateIssueArgs,
  ): Promise<void> {
    const data = ruleResult.data as any;
    const gitApiInfos: GitApiInfos = ruleResult.gitApiInfos;
    const gitIssueInfos: GitIssueInfos = new GitIssueInfos();
    let arrayOfIssueNumber: number[] = new Array();

    if (typeof data.issueNumber === 'number') {
      arrayOfIssueNumber.push(data.issueNumber);
    } else {
      arrayOfIssueNumber = data.issueNumber;
    }

    arrayOfIssueNumber.forEach(issueNumber => {
      gitIssueInfos.number = issueNumber.toString();

      if (typeof args.state !== 'undefined') {
        gitIssueInfos.state =
          args.state.toLowerCase() === 'open'
            ? IssuePRStateEnum.Open
            : args.state.toLowerCase() === 'close'
            ? IssuePRStateEnum.Close
            : IssuePRStateEnum.Undefined;
      }

      if (typeof args.labels !== 'undefined') {
        gitIssueInfos.labels = args.labels;
      }

      if (gitApiInfos.git === GitTypeEnum.Github) {
        this.githubService.updateIssue(gitApiInfos, gitIssueInfos);
      } else if (gitApiInfos.git === GitTypeEnum.Gitlab) {
        this.gitlabService.updateIssue(gitApiInfos, gitIssueInfos);
      }
    });
  }
}
