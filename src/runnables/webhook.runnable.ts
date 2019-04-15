import { Runnable } from './runnable.class';
import { HttpService } from '@nestjs/common';
import { RuleResult } from '../rules/ruleResult';
import { render } from 'mustache';
import { CallbackType } from './runnables.service';
import { logger } from '../logger/logger.service';
import { RunnableDecorator } from './runnable.decorator';
import { Utils } from '../utils/utils';

interface WebhookArgs {
  url: string;
  data: object;
  config: object;
}

/**
 * `WebhookRunnable` sends a POST request to the provided URL with custom `body` and `config`.
 */
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
        render(JSON.stringify(Utils.getObjectValue(args.config)), ruleResult),
      )
      .subscribe(
        response => {
          logger.info(render(args.url, ruleResult) + ' was correctly called');
        },
        err => logger.error(err),
      );
  }
}
