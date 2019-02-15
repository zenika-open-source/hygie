import { Webhook } from '../webhook/webhook';
import { GitEventEnum } from '../webhook/utils.enum';
import { logger } from '../logger/logger.service';
import { RunnableInterface } from '../interfaces/runnable.interface';
import { LoggerRunnable } from './logger.runnable';

export interface OnSuccessError {
  callback: string;
  args: any[];
}

export function getRunnable(name: string): RunnableInterface {
  let runnable: RunnableInterface;
  switch (name) {
    case 'LoggerRunnable':
      runnable = new LoggerRunnable();
      break;
  }
  return runnable;
}

export abstract class Rule {
  name: string;
  enabled: boolean;
  events: GitEventEnum[];
  onSuccess: OnSuccessError[];
  onError: OnSuccessError[];
  options: object;

  webhook: Webhook;

  constructor(webhook: Webhook) {
    this.webhook = webhook;
  }

  displayRule(): void {
    logger.info('Display rule');
    logger.info('name:' + this.name);
    logger.info('enabled:' + this.enabled);
    logger.info('events:' + this.events);
    logger.info('onSuccess:' + this.onSuccess);
    logger.info('onError:' + this.onError);
    logger.info('options:' + this.options);
  }

  isEnabled() {
    let events: boolean = false;
    this.events.forEach(e => {
      if (e === this.webhook.gitEvent) {
        events = true;
      }
    });
    return this.enabled && events;
  }

  excecuteValidationFunctions(ruleSuccessed: boolean): boolean {
    let runnable: RunnableInterface;
    if (ruleSuccessed) {
      this.onSuccess.forEach(success => {
        runnable = getRunnable(success.callback);
        runnable.run(success.args);
      });
      return true;
    } else {
      this.onError.forEach(error => {
        runnable = getRunnable(error.callback);
        runnable.run(error.args);
      });
      return false;
    }
  }

  abstract validate(): boolean;
}
