import { Injectable, HttpService } from '@nestjs/common';
import { RunnableInterface } from '../interfaces/runnable.interface';
import { LoggerRunnable } from './logger.runnable';
import { Rule } from '../rules/rule.class';
import { WebhookRunnable } from './webhook.runnable';

@Injectable()
export class Runnable {
  constructor(private readonly httpService: HttpService) {}

  getRunnable(name: string): RunnableInterface {
    let runnable: RunnableInterface;
    switch (name) {
      case 'LoggerRunnable':
        runnable = new LoggerRunnable();
        break;
      case 'WebhookRunnable':
        runnable = new WebhookRunnable(this.httpService);
        break;
    }
    return runnable;
  }

  executeRunnableFunctions(ruleSuccessed: boolean, rule: Rule): boolean {
    let runnable: RunnableInterface;
    if (ruleSuccessed) {
      rule.onSuccess.forEach(success => {
        runnable = this.getRunnable(success.callback);
        runnable.run(success.args);
      });
      return true;
    } else {
      rule.onError.forEach(error => {
        runnable = this.getRunnable(error.callback);
        runnable.run(error.args);
      });
      return false;
    }
  }
}
