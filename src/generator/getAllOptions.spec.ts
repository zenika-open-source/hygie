import { getAllOptions } from './getAllOptions';

const fs = require('fs-extra');
jest.mock('fs-extra');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('getAllOptions', () => {
  it('should return an array of option objects', () => {
    fs.readFileSync.mockReturnValue(`/**
* Options supported in the \`.rulesrc\` file
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
    }
    }
}`);

    expect(getAllOptions()).toEqual([
      {
        name: 'executeAllRules',
        value: false,
        tooltip: 'Specify if the process continue when a rule does not succeed',
      },
      {
        name: 'enableRules',
        value: true,
        tooltip: 'Specify if rules will be processed',
      },
      {
        name: 'enableGroups',
        value: true,
        tooltip: 'Specify if groups will be processed',
      },
      {
        name: 'allRuleResultInOne',
        value: false,
        tooltip:
          'Specify if execute a runnable only once with the result of all rules',
      },
    ]);
  });
});
