import { RulesOptions } from './rules.options';

describe('rules options', () => {
  it('should initalize RulesOptions object with defaults values', () => {
    const rulesOptions: RulesOptions = new RulesOptions();
    expect(rulesOptions).toEqual({
      allRuleResultInOne: false,
      enableGroups: true,
      enableRules: true,
      executeAllRules: false,
    });
  });

  it('should initalize RulesOptions object with customs values', () => {
    const rulesOptions: RulesOptions = new RulesOptions({
      allRuleResultInOne: true,
      enableGroups: false,
      enableRules: false,
      executeAllRules: true,
    });
    expect(rulesOptions).toEqual({
      allRuleResultInOne: true,
      enableGroups: false,
      enableRules: false,
      executeAllRules: true,
    });
  });
});
