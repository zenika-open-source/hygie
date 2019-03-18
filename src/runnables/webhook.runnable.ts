import { Runnable } from './runnable.class';
import { HttpService } from '@nestjs/common';
import { RuleResult } from '../rules/ruleResult';
import { render } from 'mustache';
import { CallbackType } from './runnables.service';
import { getObjectValue } from '../utils/convert.utils';
import { logger } from '../logger/logger.service';
import { RunnableDecorator } from './runnable.decorator';

interface WebhookArgs {
  url: string;
  data: object;
  config: object;
}

@RunnableDecorator('WebhookRunnable')
export class WebhookRunnable extends Runnable {
  constructor(private readonly httpService: HttpService) {
    super();
  }

  run(
    callbackType: CallbackType,
    ruleResult: RuleResult,
    args: WebhookArgs,
  ): void {
    this.httpService
      .post(
        render(args.url, ruleResult),
        render(JSON.stringify(args.data), ruleResult),
        render(JSON.stringify(getObjectValue(args.config)), ruleResult),
      )
      .subscribe(null, err => logger.error(err));
  }
}
