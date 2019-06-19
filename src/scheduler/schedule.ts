import { Injectable, HttpService } from '@nestjs/common';
import { NestSchedule, Cron } from '@dxdeveloperexperience/nest-schedule';
import { logger } from '../logger/logger.service';
import { Utils } from '../utils/utils';
import { CronStandardClass } from './cron.interface';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { Webhook } from '../webhook/webhook';
import { RulesService } from '../rules/rules.service';
import { RemoteConfigUtils } from '../remote-config/utils';
import { checkCronExpression } from './utils';
import { GitTypeEnum } from '../webhook/utils.enum';
import { DataAccessService } from '../data_access/dataAccess.service';
import { Constants } from '../utils/constants';

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
    private readonly dataAccessService: DataAccessService,
    cron: CronStandardClass,
  ) {
    super();
    this.id = `${Utils.getRepositoryFullName(cron.projectURL)}/${
      cron.filename
    }`;
    this.cron = cron;
    this.cron.updatedAt = new Date();

    this.remoteEnvs = Utils.getRepositoryFullName(this.cron.projectURL);
    this.remoteRepository =
      'remote-rules/' +
      Utils.getRepositoryFullName(cron.projectURL) +
      '/.hygie';

    // Init Webhook
    this.webhook = new Webhook(this.gitlabService, this.githubService);
    this.webhook.setCronWebhook(cron);

    // Set Gitlab Project Id if needed
    this.setGitlabProjectId();

    // Store CRON
    this.dataAccessService
      .writeCron(`remote-crons/${this.id}`, this.cron)
      .then(() => {
        logger.info(`Schedule ${this.id} created.`, {
          project: this.cron.projectURL,
          location: 'ScheduleService',
        });
      })
      .catch(err => logger.error(err));

    this.updateCron(cron.expression);
  }

  /**
   * Set the Gitlab projectId if undefined
   */
  async setGitlabProjectId(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      if (
        this.webhook.gitType === GitTypeEnum.Gitlab &&
        typeof this.webhook.projectId === 'undefined'
      ) {
        await this.gitlabService.setEnvironmentVariables(
          this.dataAccessService,
          this.remoteEnvs,
        );
        const urlApi: string = this.gitlabService.urlApi;
        let url = `${urlApi}/projects/${Utils.getRepositoryFullName(
          this.cron.projectURL,
        )}`;
        url = url.replace(/\/([^\/]*)$/, '%2F' + '$1');
        const gitlabProjectId = await this.httpService
          .get(url)
          .toPromise()
          .then(response => {
            return response.data.id;
          });
        this.webhook.projectId = gitlabProjectId;
      }
      return resolve();
    });
  }

  @Cron(Constants.cronExpression, {
    startTime: new Date(),
    endTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    tz: 'Europe/Paris',
  })
  async cronJob() {
    // First check if Cron job has not been updated/removed
    const { updatedAt } = await this.dataAccessService
      .readCron(`remote-crons/${this.id}`)
      .catch(() => {
        return { updatedAt: new Date() };
      });
    if (this.cron.updatedAt.getTime() !== updatedAt.getTime()) {
      logger.error('CANCELLING CRON!');
      return true; // returning true cancel the job
    }

    // Set Git Env Vars
    if (this.webhook.gitType === GitTypeEnum.Github) {
      this.githubService
        .setEnvironmentVariables(this.dataAccessService, this.remoteEnvs)
        .catch(err =>
          logger.error(
            'There is no config.env file for the current git project',
            {
              project: this.cron.projectURL,
              location: 'ScheduleService',
            },
          ),
        );
    } else if (this.webhook.gitType === GitTypeEnum.Gitlab) {
      this.gitlabService
        .setEnvironmentVariables(this.dataAccessService, this.remoteEnvs)
        .catch(err =>
          logger.error(
            'There is no config.env file for the current git project',
            {
              project: this.cron.projectURL,
              location: 'ScheduleService',
            },
          ),
        );
    }

    logger.info(`processing '${this.cron.filename}'`, {
      project: this.cron.projectURL,
      location: 'ScheduleService',
    });

    // Testing rules
    await this.rulesService.testRules(
      this.webhook,
      this.remoteRepository,
      this.cron.filename,
    );
  }
}
