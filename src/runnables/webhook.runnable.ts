import { Runnable } from './runnable.class';
import { HttpService, Inject } from '@nestjs/common';
import { RuleResult } from '../rules/ruleResult';
import { render } from 'mustache';
import { CallbackType } from './runnables.service';
import { logger } from '../logger/logger.service';
import { RunnableDecorator } from './runnable.decorator';
import { Utils } from '../utils/utils';
import { Visitor } from 'universal-analytics';

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
  constructor(
    private readonly httpService: HttpService,
    @Inject('GoogleAnalytics')
    private readonly googleAnalytics: Visitor,
  ) {
    super();
  }

  async run(
    callbackType: CallbackType,
    ruleResult: RuleResult,
    args: WebhookArgs,
  ): Promise<void> {
    this.googleAnalytics
      .event('Runnable', 'webhook', ruleResult.projectURL)
      .send();

    this.httpService
      .post(
        render(args.url, ruleResult),
        render(JSON.stringify(args.data), ruleResult),
        render(JSON.stringify(Utils.getObjectValue(args.config)), ruleResult),
      )
      .subscribe(null, err =>
        logger.error(err, {
          location: 'WebhookRunnable',
        }),
      );
  }
}
