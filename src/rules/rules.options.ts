import { Constants } from '../utils/constants';

/**
 * Options supported in the `.rulesrc` file
 */
export class RulesOptions {
  /**
   * Specify if the process continue when a rule does not succeed
   */
  executeAllRules: boolean = false;
  /**
   * Specify if rules will be processed
   */
  enableRules: boolean = true;
  /**
   * Specify if groups will be processed
   */
  enableGroups: boolean = true;
  /**
   * Specify if execute a runnable only once with the result of all rules
   */
  allRuleResultInOne: boolean = false;
  /**
   * Cron Expression used in `cron-*.rulesrc` file
   */
  cron: string = Constants.cronExpression;

  constructor(r?: RulesOptions) {
    if (r !== undefined && r !== null) {
      this.executeAllRules =
        typeof r.executeAllRules === 'undefined'
          ? this.executeAllRules
          : r.executeAllRules;
      this.enableRules =
        typeof r.enableRules === 'undefined' ? this.enableRules : r.enableRules;
      this.enableGroups =
        typeof r.enableGroups === 'undefined'
          ? this.enableGroups
          : r.enableGroups;
      this.allRuleResultInOne =
        typeof r.allRuleResultInOne === 'undefined'
          ? this.allRuleResultInOne
          : r.allRuleResultInOne;
      this.cron = typeof r.cron === 'undefined' ? this.cron : r.cron;
    }
  }
}
