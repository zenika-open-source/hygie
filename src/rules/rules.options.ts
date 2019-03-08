import { logger } from '../logger/logger.service';

/**
 * Options supported in the `rules.yml` file
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
    }
  }
}
