import { Controller, Body, Post, UseInterceptors, Get } from '@nestjs/common';
import { Webhook } from './webhook/webhook';
import { WebhookInterceptor } from './webhook/webhook.interceptor';
import { logger } from './logger/logger.service';
import { RulesService } from './rules/rules.service';

@Controller()
export class AppController {
  constructor(private readonly rulesService: RulesService) {}

  @Get('/')
  welcome(): string {
    return '<p>Welcome, <b>Git Webhooks</b> is running!</p>';
  }

  @Post('/webhook')
  @UseInterceptors(WebhookInterceptor)
  processWebhook(@Body() webhook: Webhook): string {
    logger.info(
      `\n\n=== processWebhook - ${webhook.getGitType()} - ${
        webhook.gitEvent
      } ===\n`,
    );

    this.rulesService.testRules(webhook);

    return 'ok';
  }
}
