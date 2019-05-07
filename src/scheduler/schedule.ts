import { Injectable, HttpService } from '@nestjs/common';
import { NestSchedule, Cron } from '@dxdeveloperexperience/nest-schedule';
import { logger } from '../logger/logger.service';
import { Utils } from '../utils/utils';
import { CronStandardClass } from './cron.interface';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { Webhook } from '../webhook/webhook';
import { RulesService } from '../rules/rules.service';
import { safeLoad } from 'js-yaml';
import { RemoteConfigUtils } from '../remote-config/utils';

@Injectable()
export class Schedule extends NestSchedule {
  readonly id: string;
  readonly remoteEnvs: string;
  readonly remoteRepository: string;
  readonly webhook: Webhook;

  readonly cron: CronStandardClass;

  constructor(
    private readonly githubService: GithubService,
    private readonly gitlabService: GitlabService,
    private readonly rulesService: RulesService,
    private readonly httpService: HttpService,
    cron: CronStandardClass,
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

  @Cron('*/30 * * * * *', {
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

    logger.info(`${this.id}: downloading ${this.cron.filename}...`);

    try {
      await RemoteConfigUtils.downloadRulesFile(
        this.httpService,
        this.cron.projectURL,
        this.cron.filename,
      ).catch(e => {
        throw e;
      });
    } catch (e) {
      logger.error(e);
    }

    logger.info(`${this.cron.filename} downloaded. Processing...`);

    // Update CRON Expression if defined in the rules-cron file
    const fs = require('fs-extra');
    const options = safeLoad(
      fs.readFileSync(
        this.remoteRepository + '/' + this.cron.filename,
        'utf-8',
      ),
    ).options;
    if (typeof options !== 'undefined') {
      const cronExpression = options.cron;
      if (typeof cronExpression !== 'undefined') {
        this.updateCron(cronExpression);
      }
    }

    // Testing rules
    await this.rulesService.testRules(
      this.webhook,
      this.remoteRepository,
      this.cron.filename,
    );
  }
}
