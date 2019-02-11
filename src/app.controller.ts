import { Controller, Body, Post, Get } from '@nestjs/common';
import { GithubService } from './github/github.service';
import { GitlabService } from './gitlab/gitlab.service';
import { Webhook } from './webhook/webhook';
import { logger } from './logger/logger.service';
import { GithubEvent } from './github/githubEvent';
import { GitlabEvent } from './gitlab/gitlabEvent';
import { Rule } from './rules/rule.class';
import { getRules } from './rules/utils';

@Controller()
export class AppController {
  constructor(
    private readonly gitlabService: GitlabService,
    private readonly githubService: GithubService,
  ) {}

  @Post('/webhook')
  processWebhook(@Body() webhookDto: GithubEvent | GitlabEvent): string {
    const webhook: Webhook = new Webhook(
      this.gitlabService,
      this.githubService,
    );

    logger.info('\n\n========== webhook received ==========\n');
    // this webhook object now contains all data we need
    webhook.gitToWebhook(webhookDto);

    const rules: Rule[] = getRules(webhook);
    const BreakException = {};

    try {
      rules.forEach(r => {
        if (r.isEnabled()) {
          if (!r.validate()) {
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
