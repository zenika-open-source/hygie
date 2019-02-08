import { GitEventEnum } from 'src/webhook/utils.enum';
import { safeLoad } from 'js-yaml';
import { readFileSync } from 'fs';
import { logger } from './../logger/logger.service';

// export type CallbackFunction = (...args: any[]) => any;

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

export interface OnSuccessError {
  callback: string;
  args: any[];
}

export class Rule {
  name: string;
  event: GitEventEnum;
  field: string;
  regexp: string;
  onSuccess: OnSuccessError[];
  onError: OnSuccessError[];
}

export function getRules(): Rule[] {
  const config = safeLoad(readFileSync('src/rules/rules.yml', 'utf-8'));
  return config.rules;
}
