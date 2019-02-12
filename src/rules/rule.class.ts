import { Webhook } from '../webhook/webhook';
import { GitEventEnum } from '../webhook/utils.enum';
import { logger } from '../logger/logger.service';

export interface OnSuccessError {
  callback: string;
  args: any[];
}

export function callFunction(callback: string, ...args: any[]) {
  switch (callback) {
    case 'logger.info':
      logger.info(args);
      break;
    case 'logger.warn':
      logger.warn(args);
      break;
  }
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
    if (ruleSuccessed) {
      this.onSuccess.forEach(success => {
        callFunction(success.callback, success.args);
      });
      return true;
    } else {
      this.onError.forEach(error => {
        callFunction(error.callback, error.args);
      });
      return false;
    }
  }

  abstract validate(): boolean;
}
