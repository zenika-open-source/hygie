import { RuleResult } from '../rules/ruleResult';
import { CallbackType } from './runnables.service';

export abstract class Runnable {
  name: string;
  abstract async run(
    callbackType: CallbackType,
    ruleResult: RuleResult,
    ...args: any[]
  ): Promise<void>;
}
