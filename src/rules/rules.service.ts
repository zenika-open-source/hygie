import { Injectable, HttpService } from '@nestjs/common';
import { Rule } from './rule.class';
import { getRules } from './utils';
import { Runnable } from '../runnables/runnable';
import { Webhook } from '../webhook/webhook';

@Injectable()
export class RulesService {
  constructor(
    private readonly httpService: HttpService,
    private readonly rulesClasses: Rule[],
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  testRules(webhook: Webhook): void {
    const rules: Rule[] = getRules(webhook);
    const BreakException = {};

    const runnable: Runnable = new Runnable(this.httpService);
    try {
      rules.forEach(r => {
        if (r.isEnabled()) {
          const isValidated: boolean = r.validate();
          runnable.executeRunnableFunctions(isValidated, r);
          if (!isValidated) {
            throw BreakException;
          }
        }
      });
    } catch (e) {
      if (e !== BreakException) {
        throw e;
      }
    }
  }
}
