import { Injectable } from '@nestjs/common';
import { Runnable } from './runnable.class';
import { Rule } from '../rules/rule.class';
import { RuleResult } from '../rules/ruleResult';
import { Group } from '../rules/group.class';

export enum CallbackType {
  Success = 'Success',
  Error = 'Error',
  Both = 'Both',
}

@Injectable()
export class RunnablesService {
  constructor(private readonly runnablesClasses: Runnable[] = []) {}

  getRunnable(name: string): Runnable {
    return this.runnablesClasses.find(r => r.name === name);
  }
  async executeRunnableFunctions(
    ruleResult: RuleResult,
    ruleOrGroup: Rule | Group,
  ): Promise<boolean> {
    let runnable: Runnable;

    if (typeof ruleOrGroup.onBoth !== 'undefined') {
      ruleOrGroup.onBoth.forEach(both => {
        runnable = this.getRunnable(both.callback);
        runnable.run(CallbackType.Both, ruleResult, both.args);
      });
    }

    if (ruleResult.validated && typeof ruleOrGroup.onSuccess !== 'undefined') {
      ruleOrGroup.onSuccess.forEach(success => {
        runnable = this.getRunnable(success.callback);
        runnable.run(CallbackType.Success, ruleResult, success.args);
      });
      return Promise.resolve(true);
    } else if (
      !ruleResult.validated &&
      typeof ruleOrGroup.onError !== 'undefined'
    ) {
      ruleOrGroup.onError.forEach(error => {
        runnable = this.getRunnable(error.callback);
        runnable.run(CallbackType.Error, ruleResult, error.args);
      });
      return Promise.resolve(false);
    }
    return Promise.resolve(false);
  }
}
