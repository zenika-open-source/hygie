import {
  Controller,
  Body,
  Post,
  UseInterceptors,
  Get,
  Res,
  HttpStatus,
  UseFilters,
  Header,
} from '@nestjs/common';
import { Webhook } from './webhook/webhook';
import { WebhookInterceptor } from './webhook/webhook.interceptor';
import { logger } from './logger/logger.service';
import { RulesService } from './rules/rules.service';
import { GitTypeEnum, GitEventEnum } from './webhook/utils.enum';
import { AllExceptionsFilter } from './exceptions/allExceptionFilter';
import { PreconditionException } from './exceptions/precondition.exception';
import { getAllRules } from './generator/getAllRules';
import { getAllRunnables } from './generator/getAllRunnables';
import { getAllOptions } from './generator/getAllOptions';

@Controller()
export class AppController {
  constructor(private readonly rulesService: RulesService) {}

  @Get('/')
  welcome(): string {
    return '<p>Welcome, <b>Git Webhooks</b> is running!</p>';
  }

  @Get('/rules')
  @Header('Access-Control-Allow-Origin', '*')
  getAllRules(): object {
    return getAllRules();
  }

  @Get('/runnables')
  @Header('Access-Control-Allow-Origin', '*')
  getAllRunnables(): object {
    return getAllRunnables();
  }

  @Get('/options')
  @Header('Access-Control-Allow-Origin', '*')
  getAllOptions(): object {
    return getAllOptions();
  }

  @Post('/webhook')
  @UseInterceptors(WebhookInterceptor)
  @UseFilters(AllExceptionsFilter)
  processWebhook(@Body() webhook: Webhook, @Res() response): void {
    if (
      webhook.getGitType() === GitTypeEnum.Undefined ||
      webhook.getGitEvent() === GitEventEnum.Undefined
    ) {
      throw new PreconditionException();
    } else {
      logger.info(
        `\n\n=== processWebhook - ${webhook.getGitType()} - ${webhook.getGitEvent()} ===\n`,
      );

      const result = this.rulesService.testRules(webhook);
      response.status(HttpStatus.ACCEPTED).send(result);
    }
  }
}
