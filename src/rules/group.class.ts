import { OnSuccessError, Rule } from './rule.class';
import { logger } from '../logger/logger.service';

export class Group {
  groupName: string;
  rules: Rule[];
  onSuccess: OnSuccessError[];
  onError: OnSuccessError[];
  onBoth: OnSuccessError[];

  displayInformations(): void {
    logger.info(`== ${this.groupName} ==`);
    if (this.rules !== undefined) {
      logger.info(`> ${this.rules.length} rules`);
    }
    if (this.onSuccess !== undefined) {
      logger.info(`> ${this.onSuccess.length} onSuccess callback`);
    }
    if (this.onError !== undefined) {
      logger.info(`> ${this.onError.length} onError callback`);
    }
    if (this.onBoth !== undefined) {
      logger.info(`> ${this.onBoth.length} onBoth callback`);
    }
  }
}
