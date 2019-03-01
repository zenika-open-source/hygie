import { RunnableInterface } from './runnable.interface';
import { logger } from '../logger/logger.service';
import { RuleResult } from '../rules/ruleResult';
import { render } from 'mustache';
import { CallbackType } from './runnable';

interface LoggerArgs {
  type: string;
  message: string;
}
export class LoggerRunnable implements RunnableInterface {
  name: string = 'LoggerRunnable';

  run(
    callbackType: CallbackType,
    ruleResult: RuleResult,
    args: LoggerArgs,
  ): void {
    // Defaults
    if (
      typeof args.type === 'undefined' &&
      callbackType === CallbackType.Success
    ) {
      args.type = 'info';
    } else if (
      typeof args.type === 'undefined' &&
      callbackType === CallbackType.Error
    ) {
      args.type = 'warn';
    }

    switch (args.type) {
      case 'info':
        logger.info(render(args.message, ruleResult));
        break;
      case 'warn':
        logger.warn(render(args.message, ruleResult));
        break;
    }
  }
}
