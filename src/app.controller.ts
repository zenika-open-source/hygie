import {
  Controller,
  Body,
  Post,
  UseInterceptors,
  Get,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Webhook } from './webhook/webhook';
import { WebhookInterceptor } from './webhook/webhook.interceptor';
import { logger } from './logger/logger.service';
import { RulesService } from './rules/rules.service';
import { GitTypeEnum, GitEventEnum } from './webhook/utils.enum';

@Controller()
export class AppController {
  constructor(private readonly rulesService: RulesService) {}

  @Get('/')
  welcome(): string {
    return '<p>Welcome, <b>Git Webhooks</b> is running!</p>';
  }

  @Post('/webhook')
  @UseInterceptors(WebhookInterceptor)
  processWebhook(@Body() webhook: Webhook, @Res() response): void {
    if (
      webhook.getGitType() === GitTypeEnum.Undefined ||
      webhook.getGitEvent() === GitEventEnum.Undefined
    ) {
      response.status(HttpStatus.PRECONDITION_FAILED).send();
    } else {
      logger.info(
        `\n\n=== processWebhook - ${webhook.getGitType()} - ${webhook.getGitEvent()} ===\n`,
      );

      this.rulesService.testRules(webhook);
      response.status(HttpStatus.ACCEPTED).send();
    }
  }
}
