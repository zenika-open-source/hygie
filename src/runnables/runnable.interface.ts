import { RuleResult } from '../rules/ruleResult';

export interface RunnableInterface {
  name: string;
  run(ruleResult: RuleResult, ...args: any[]): void;
}
