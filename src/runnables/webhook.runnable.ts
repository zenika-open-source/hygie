import { RunnableInterface } from './runnable.interface';
import { HttpService, Injectable } from '@nestjs/common';
import { RuleResult } from '../rules/ruleResult';
import { render } from 'mustache';
import { CallbackType } from './runnable';

interface WebhookArgs {
  url: string;
  data: object;
  config?: object;
}

@Injectable()
export class WebhookRunnable implements RunnableInterface {
  constructor(private readonly httpService: HttpService) {}

  name: string = 'WebhookRunnable';

  run(
    callbackType: CallbackType,
    ruleResult: RuleResult,
    args: WebhookArgs,
  ): void {
    this.httpService
      .post(
        render(args.url, ruleResult),
        render(JSON.stringify(args.data), ruleResult),
        render(JSON.stringify(args.config), ruleResult),
      )
      .subscribe();
  }
}
