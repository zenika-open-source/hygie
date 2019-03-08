import { GitApiInfos } from '../git/gitApiInfos';

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
  data: object;
  /**
   * Provide informations to `Runnable` to interact with Git API
   */
  gitApiInfos: GitApiInfos;

  constructor(gitApiInfos: GitApiInfos) {
    this.gitApiInfos = gitApiInfos;
  }
}
