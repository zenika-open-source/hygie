import { Injectable } from '@nestjs/common';
import { Runnable } from './runnable.class';
import { Rule } from '../rules/rule.class';
import { RuleResult } from '../rules/ruleResult';
import { Group } from '../rules/group.class';
import { logger } from '../logger/logger.service';

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
        runnable
          .run(CallbackType.Both, ruleResult, both.args)
          .catch(err => logger.error(err));
      });
    }

    if (ruleResult.validated && typeof ruleOrGroup.onSuccess !== 'undefined') {
      ruleOrGroup.onSuccess.forEach(success => {
        runnable = this.getRunnable(success.callback);
        runnable
          .run(CallbackType.Success, ruleResult, success.args)
          .catch(err => logger.error(err));
      });
      return true;
    } else if (
      !ruleResult.validated &&
      typeof ruleOrGroup.onError !== 'undefined'
    ) {
      ruleOrGroup.onError.forEach(error => {
        runnable = this.getRunnable(error.callback);
        runnable
          .run(CallbackType.Error, ruleResult, error.args)
          .catch(err => logger.error(err));
      });
      return false;
    }
    return false;
  }
}
