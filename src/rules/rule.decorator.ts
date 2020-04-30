import { Rule } from './rule.class';
import { analytics } from '../analytics/analytics.service';

export function RuleDecorator(ruleName): ClassDecorator {
  return (target: any) => {
    target.prototype.name = ruleName;
  };
}
