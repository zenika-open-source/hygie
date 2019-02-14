import { Controller, Body, Post, UseInterceptors, Get } from '@nestjs/common';
import { Webhook } from './webhook/webhook';
import { Rule } from './rules/rule.class';
import { getRules } from './rules/utils';
import { WebhookInterceptor } from './webhook/webhook.interceptor';
import { logger } from './logger/logger.service';

@Controller()
export class AppController {
  @Get('/')
  test(): string {
    return 'Welcome, <b>Git Webhooks</b> is running!';
  }

  @Post('/webhook')
  @UseInterceptors(WebhookInterceptor)
  processWebhook(@Body() webhook: Webhook): string {
    logger.info('\n\n=== processWebhook ===\n');
    const rules: Rule[] = getRules(webhook);
    const BreakException = {};

    try {
      rules.forEach(r => {
        if (r.isEnabled() && !r.validate()) {
          throw BreakException;
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
