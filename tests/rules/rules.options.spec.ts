import { RulesOptions } from '../../src/rules/rules.options';
import { Constants } from '../../src/utils/constants';

describe('rules options', () => {
  it('should initalize RulesOptions object with defaults values', () => {
    const rulesOptions: RulesOptions = new RulesOptions();
    expect(rulesOptions).toEqual({
      allRuleResultInOne: false,
      enableGroups: true,
      enableRules: true,
      executeAllRules: false,
      cron: Constants.cronExpression,
    });
  });

  it('should initalize RulesOptions object with customs values', () => {
    const rulesOptions: RulesOptions = new RulesOptions({
      allRuleResultInOne: true,
      enableGroups: false,
      enableRules: false,
      executeAllRules: true,
      cron: '0 0 8-20/1 * * *',
    });
    expect(rulesOptions).toEqual({
      allRuleResultInOne: true,
      enableGroups: false,
      enableRules: false,
      executeAllRules: true,
      cron: '0 0 8-20/1 * * *',
    });
  });
});
