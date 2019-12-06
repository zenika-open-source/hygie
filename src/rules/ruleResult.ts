import { GitApiInfos } from '../git/gitApiInfos';
import { Webhook } from '../webhook/webhook';

/**
 * Contains the result of the rule `validate()` method.
 */
export class RuleResult {
  /**
   * Specify if the rule succeed
   */
  validated: boolean;
  /**
   * Contains meta-data that can be used by `Runnable` (in the `args` object)
   */
  data: any;
  /**
   * Provide informations to `Runnable` to interact with Git API
   */
  gitApiInfos: GitApiInfos;
  /**
   * Project URL of the caller, used for Analytics
   */
  projectURL: string;

  /**
   * Contains all environment variables set in the current project
   */
  env: object;

  constructor(webhook: Webhook) {
    this.gitApiInfos = webhook.getGitApiInfos();
    this.projectURL = webhook.getCloneURL();
    this.data = webhook;
  }
}
