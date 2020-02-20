import { Runnable } from './runnable.class';
import { HttpService, Logger } from '@nestjs/common';
import { RuleResult } from '../rules/ruleResult';

import { CallbackType } from './runnables.service';
import { RunnableDecorator } from './runnable.decorator';
import { Utils } from '../utils/utils';
import { EnvVarAccessor } from '../env-var/env-var.accessor';
import { AnalyticsDecorator } from '../analytics/analytics.decorator';
import { HYGIE_TYPE } from '../utils/enum';

interface WebhookArgs {
  url: string;
  data: object | string;
  config: object | string;
}

/**
 * `WebhookRunnable` sends a POST request to the provided URL with custom `body` and `config`.
 */
@RunnableDecorator('WebhookRunnable')
export class WebhookRunnable extends Runnable {
  constructor(
    private readonly httpService: HttpService,
    private readonly envVarAccessor: EnvVarAccessor,
  ) {
    super();
  }

  @AnalyticsDecorator(HYGIE_TYPE.RUNNABLE)
  async run(
    callbackType: CallbackType,
    ruleResult: RuleResult,
    args: WebhookArgs,
  ): Promise<void> {
    ruleResult.env = this.envVarAccessor.getAllEnvVar();

    const url: string = Utils.render(args.url, ruleResult);
    let config: any = {};
    let data: string;

    try {
      if (typeof args.data === 'string') {
        data = Utils.render(args.data, ruleResult);
      } else {
        data = Utils.render(JSON.stringify(args.data), ruleResult);
      }
      if (typeof args.config === 'string') {
        config = JSON.parse(Utils.render(args.config, ruleResult));
      } else if (typeof args.config !== 'undefined') {
        config = JSON.parse(
          Utils.render(JSON.stringify(args.config), ruleResult),
        );
      }
    } catch (err) {
      Logger.error(err, 'WebhookRunnable');
    }

    this.httpService
      .post(url, data, config)
      .subscribe(null, err => Logger.error(err, 'WebhookRunnable - post'));
  }
}
