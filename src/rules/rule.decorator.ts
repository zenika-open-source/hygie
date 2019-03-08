import { Rule } from './rule.class';

export function RuleDecorator(ruleName): ClassDecorator {
  return (target: object) => {
    (target as Rule).name = ruleName;
  };
}
