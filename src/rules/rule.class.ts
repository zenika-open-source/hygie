import { Webhook } from '../webhook/webhook';
import { GitEventEnum } from '../webhook/utils.enum';
import { logger } from '../logger/logger.service';
import { RuleResult } from './ruleResult';

export interface OnSuccessError {
  callback: string;
  args: any;
}

export abstract class Rule {
  name: string;
  enabled: boolean;
  events: GitEventEnum[];
  onSuccess: OnSuccessError[];
  onError: OnSuccessError[];
  options: object;

  constructor() {
    this.enabled = true;
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

  isEnabled(webhook: Webhook, ruleConfig) {
    const events = ruleConfig.events || this.events;
    const enabled = ruleConfig.enable === undefined ? true : ruleConfig.enabled;
    let eventEnabled: boolean = false;
    events.forEach(e => {
      if (e === webhook.gitEvent) {
        eventEnabled = true;
      }
    });
    return enabled && eventEnabled;
  }

  abstract validate(webhook: Webhook, ruleConfig): RuleResult;
}
