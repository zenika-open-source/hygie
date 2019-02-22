import { RunnableInterface } from './runnable.interface';
import { logger } from '../logger/logger.service';
import { RuleResult } from '../rules/ruleResult';
import { render } from 'mustache';

interface LoggerArgs {
  type: string;
  message: string;
}
export class LoggerRunnable implements RunnableInterface {
  name: string = 'LoggerRunnable';

  run(ruleResult: RuleResult, args: LoggerArgs): void {
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
