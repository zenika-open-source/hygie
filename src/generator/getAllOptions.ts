import { RulesOptions } from '../rules/rules.options';

export function getAllOptions(): object {
  return Object.entries(new RulesOptions()).map(o => {
    return {
      name: o[0],
      value: o[1],
    };
  });
}
