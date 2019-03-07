import { OnSuccessError, Rule } from './rule.class';
import { logger } from '../logger/logger.service';

export class Group {
  groupName: string;
  rules: Rule[];
  onSuccess: OnSuccessError[];
  onError: OnSuccessError[];

  displayInformations(): void {
    logger.info(`== ${this.groupName} ==`);
    logger.info(`> ${this.rules.length} rules`);
    logger.info(`> ${this.onSuccess.length} onSuccess callback`);
    logger.info(`> ${this.onError.length} onError callback`);
  }
}
