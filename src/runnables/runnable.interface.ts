import { RuleResult } from '../rules/ruleResult';
import { CallbackType } from './runnable';

export interface RunnableInterface {
  name: string;
  run(callbackType: CallbackType, ruleResult: RuleResult, ...args: any[]): void;
}
