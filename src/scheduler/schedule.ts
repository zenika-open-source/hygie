import { Injectable } from '@nestjs/common';
import { NestSchedule, Cron } from '@dxdeveloperexperience/nest-schedule';
import { logger } from '../logger/logger.service';
import { Utils } from '../utils/utils';
import { CronInterface } from './cron.interface';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { PreconditionException } from '../exceptions/precondition.exception';
import { Webhook } from '../webhook/webhook';
import { RulesService } from '../rules/rules.service';

@Injectable()
export class Schedule extends NestSchedule {
  readonly id: string;
  readonly remoteEnvs: string;
  readonly remoteRepository: string;
  readonly webhook: Webhook;

  readonly cron: CronInterface;

  constructor(
    private readonly githubService: GithubService,
    private readonly gitlabService: GitlabService,
    private readonly rulesService: RulesService,
    cron: CronInterface,
    remoteRepository: string,
  ) {
    super();
    this.id = Utils.generateUniqueId();
    this.cron = cron;
    logger.info('Schedule :' + this.cron.filename);

    this.remoteEnvs = Utils.getRepositoryFullName(this.cron.projectURL);
    this.remoteRepository = remoteRepository;

    // Init Webhook
    this.webhook = new Webhook(this.gitlabService, this.githubService);
    this.webhook.setCronWebhook(cron);
  }

  @Cron('*/5 * * * * *', {
    startTime: new Date(),
    endTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    tz: 'Europe/Paris',
  })
  async cronJob() {
    try {
      this.githubService.setEnvironmentVariables(this.remoteEnvs);
      this.gitlabService.setEnvironmentVariables(this.remoteEnvs);
    } catch (e) {
      logger.error(e);
      logger.error('There is no config.env file for the current git project');
    }

    logger.info(`${this.id}: will execute ${this.cron.filename}`);

    const results = await this.rulesService.testRules(
      this.webhook,
      this.remoteRepository,
      this.cron.filename,
    );

    // tslint:disable-next-line:no-console
    console.log(results);
  }
}
