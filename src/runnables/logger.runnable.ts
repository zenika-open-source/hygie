import { RunnableInterface } from './runnable.interface';
import { logger } from '../logger/logger.service';

interface LoggerArgs {
  type: string;
  message: string;
}
export class LoggerRunnable implements RunnableInterface {
  name: string = 'LoggerRunnable';

  run(args: LoggerArgs): void {
    switch (args.type) {
      case 'info':
        logger.info(args.message);
        break;
      case 'warn':
        logger.warn(args.message);
        break;
    }
  }
}
