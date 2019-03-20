import { Runnable } from './runnable.class';
import { logger } from '../logger/logger.service';
import { RuleResult } from '../rules/ruleResult';
import { render } from 'mustache';
import { CallbackType } from './runnables.service';
import { RunnableDecorator } from './runnable.decorator';

interface LoggerArgs {
  type: string;
  message: string;
}

/**
 * `LoggerRunnable` logs informations in your terminal.
 */
@RunnableDecorator('LoggerRunnable')
export class LoggerRunnable extends Runnable {
  run(
    callbackType: CallbackType,
    ruleResult: RuleResult,
    args: LoggerArgs,
  ): void {
    // Defaults
    if (
      typeof args.type === 'undefined' &&
      callbackType === CallbackType.Error
    ) {
      args.type = 'warn';
    } else if (typeof args.type === 'undefined') {
      args.type = 'info';
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
