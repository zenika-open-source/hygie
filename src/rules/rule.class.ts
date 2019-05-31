import { Webhook } from '../webhook/webhook';
import { GitEventEnum } from '../webhook/utils.enum';
import { logger } from '../logger/logger.service';
import { RuleResult } from './ruleResult';

export interface OnSuccessError {
  callback: string;
  args?: any;
}

/**
 * Provide methods that must be implement by all future rules
 */
export abstract class Rule {
  name: string;
  enabled: boolean;
  events: GitEventEnum[];
  onSuccess: OnSuccessError[];
  onError: OnSuccessError[];
  onBoth: OnSuccessError[];
  options: object;

  constructor() {
    this.enabled = true;
  }

  /**
   * Display each rule's properties
   */
  displayRule(): void {
    logger.info('Display rule');
    logger.info('name:' + this.name);
    logger.info('enabled:' + this.enabled);
    logger.info('events:' + this.events);
    logger.info('onSuccess:' + this.onSuccess);
    logger.info('onError:' + this.onError);
    logger.info('onBoth:' + this.onBoth);
    logger.info('options:' + this.options);
  }

  /**
   * Check if the rule can be apply to the received `webhook`, according to the `ruleConfig`
   * @param webhook
   * @param ruleConfig
   */
  isEnabled(webhook: Webhook, ruleConfig) {
    const events = ruleConfig.events || this.events;
    const enabled =
      ruleConfig.enabled === undefined ? true : ruleConfig.enabled;
    let eventEnabled: boolean = false;
    events.forEach(e => {
      if (e === webhook.gitEvent) {
        eventEnabled = true;
      }
    });

    return enabled && eventEnabled;
  }

  /**
   * Abstract method that must be implemented by all rules. Contains all the business logic of the rule
   * @param webhook
   * @param ruleConfig
   */
  abstract async validate(
    webhook: Webhook,
    ruleConfig: Rule,
    ruleResults?: RuleResult[],
  ): Promise<RuleResult>;
}
