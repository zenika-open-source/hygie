import { RuleResult } from '../rules/ruleResult';
import { CallbackType } from './runnables.service';

export abstract class Runnable {
  name: string;
  abstract run(
    callbackType: CallbackType,
    ruleResult: RuleResult,
    ...args: any[]
  ): void;
}
