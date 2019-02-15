import {
  Controller,
  Body,
  Post,
  UseInterceptors,
  Get,
  HttpService,
} from '@nestjs/common';
import { Webhook } from './webhook/webhook';
import { Rule } from './rules/rule.class';
import { getRules } from './rules/utils';
import { WebhookInterceptor } from './webhook/webhook.interceptor';
import { logger } from './logger/logger.service';
import { Runnable } from './runnables/runnable';

@Controller()
export class AppController {
  constructor(private readonly httpService: HttpService) {}

  @Get('/')
  test(): string {
    return '<p>Welcome, <b>Git Webhooks</b> is running!</p>';
  }

  @Post('/webhook')
  @UseInterceptors(WebhookInterceptor)
  processWebhook(@Body() webhook: Webhook): string {
    logger.info('\n\n=== processWebhook ===\n');
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

    return 'ok';
  }
}
