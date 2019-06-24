import { Runnable } from './runnable.class';
import { RuleResult } from '../rules/ruleResult';
import { render } from 'mustache';
import { CallbackType } from './runnables.service';
import { RunnableDecorator } from './runnable.decorator';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { GitApiInfos } from '../git/gitApiInfos';
import { GitMergePRInfos, PRMethodsEnum } from '../git/gitPRInfos';
import { GitTypeEnum } from '../webhook/utils.enum';
import { Inject } from '@nestjs/common';
import { Visitor } from 'universal-analytics';

interface MergePullRequestArgs {
  commitTitle: string;
  commitMessage: string;
  method: string;
  sha: string;
}

/**
 * `MergePullRequestRunnable` merge the PR or MR processed by the previous rule.
 *  @warn Be sure that the rule returned the `pullRequest.number` property in the `RuleResult` object.
 */
@RunnableDecorator('MergePullRequestRunnable')
export class MergePullRequestRunnable extends Runnable {
  constructor(
    private readonly githubService: GithubService,
    private readonly gitlabService: GitlabService,
    @Inject('GoogleAnalytics')
    private readonly googleAnalytics: Visitor,
  ) {
    super();
  }

  async run(
    callbackType: CallbackType,
    ruleResult: RuleResult,
    args: MergePullRequestArgs,
  ): Promise<void> {
    const gitApiInfos: GitApiInfos = ruleResult.gitApiInfos;
    const data = ruleResult.data as any;
    const gitMergePRInfos = new GitMergePRInfos();

    this.googleAnalytics
      .event('Runnable', 'mergePullRequest', ruleResult.projectURL)
      .send();

    gitMergePRInfos.number = data.pullRequest.number;

    if (typeof args !== 'undefined') {
      if (typeof args.commitMessage !== 'undefined') {
        gitMergePRInfos.commitMessage = render(args.commitMessage, ruleResult);
      }
      if (typeof args.commitTitle !== 'undefined') {
        gitMergePRInfos.commitTitle = render(args.commitTitle, ruleResult);
      }
      if (typeof args.sha !== 'undefined') {
        gitMergePRInfos.sha = render(args.sha, ruleResult);
      }
      if (typeof args.method !== 'undefined') {
        switch (render(args.method.toLocaleLowerCase(), ruleResult)) {
          case 'squash':
            gitMergePRInfos.method = PRMethodsEnum.Squash;
            break;
          case 'rebase':
            gitMergePRInfos.method = PRMethodsEnum.Rebase;
            break;
          case 'merge':
          default:
            gitMergePRInfos.method = PRMethodsEnum.Merge;
            break;
        }
      } else {
        gitMergePRInfos.method = PRMethodsEnum.Merge;
      }
    } else {
      // Default
      gitMergePRInfos.method = PRMethodsEnum.Merge;
    }

    if (gitApiInfos.git === GitTypeEnum.Github) {
      this.githubService.mergePullRequest(gitApiInfos, gitMergePRInfos);
    } else if (gitApiInfos.git === GitTypeEnum.Gitlab) {
      this.gitlabService.mergePullRequest(gitApiInfos, gitMergePRInfos);
    }
  }
}
