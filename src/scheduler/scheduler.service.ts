import { Injectable, HttpService, HttpStatus } from '@nestjs/common';
import { NestSchedule } from '@dxdeveloperexperience/nest-schedule';
import { Schedule } from './schedule';
import { CronStandardClass, convertCronType, CronType } from './cron.interface';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { RulesService } from '../rules/rules.service';
import { SchedulerException } from '../exceptions/scheduler.exception';
import { checkCronExpression } from './utils';
import { CronExpressionException } from '../exceptions/cronExpression.exception';
import { DataAccessService } from '../data_access/dataAccess.service';
import { HttpResponse } from '../utils/httpResponse';
import { Utils } from '../utils/utils';
import { GitTypeEnum } from '../webhook/utils.enum';
import { RemoteConfigUtils } from '../remote-config/utils';
import { Constants } from '../utils/constants';
import { logger } from '../logger/logger.service';

@Injectable()
export class ScheduleService {
  schedules: NestSchedule[] = new Array<NestSchedule>();
  readonly MAX_SCHEDULES: number = 1000;

  constructor(
    private readonly githubService: GithubService,
    private readonly gitlabService: GitlabService,
    private readonly rulesService: RulesService,
    private readonly httpService: HttpService,
    private readonly dataAccessService: DataAccessService,
  ) {}

  /**
   * Create a new Schedule and add it to the list if `MAX_SCHEDULES` is not reached
   */
  async createSchedule(cron: CronStandardClass): Promise<Schedule> {
    if (this.schedules.length < this.MAX_SCHEDULES) {
      // Download file
      try {
        await RemoteConfigUtils.downloadRulesFile(
          this.dataAccessService,
          this.httpService,
          cron.projectURL,
          cron.filename,
        ).catch(e => {
          throw e;
        });
      } catch (e) {
        logger.error(e, {
          project: cron.projectURL,
          location: 'ScheduleService',
        });
      }

      // Get CRON Expression if defined in the cron-*.rulesrc file
      const remoteRepository =
        'remote-rules/' +
        Utils.getRepositoryFullName(cron.projectURL) +
        '/.hygie';
      const conf = await Utils.parseRuleFile(
        await this.dataAccessService.readRule(
          `${remoteRepository}/${cron.filename}`,
        ),
      );
      const options = conf.options;

      if (
        typeof options !== 'undefined' &&
        typeof options.cron !== 'undefined'
      ) {
        cron.expression = options.cron;
      } else {
        cron.expression = Constants.cronExpression;
      }

      if (!checkCronExpression(cron.expression)) {
        throw new CronExpressionException(
          'Incorrect Cron Expression! You can not generate more than 1 cron job per hour.',
        );
      }

      const newSchedule = new Schedule(
        this.githubService,
        this.gitlabService,
        this.rulesService,
        this.httpService,
        this.dataAccessService,
        cron,
      );

      this.addSchedule(newSchedule);
      return newSchedule;
    } else {
      throw new SchedulerException('MAX_SCHEDULES reached!');
    }
  }

  addSchedule(schedule: NestSchedule): void {
    this.schedules.push(schedule);
  }

  async createCronJobs(cronType: CronType): Promise<HttpResponse> {
    // let fileURL: string;
    let responseString: string = '';
    let schedule: Schedule;
    let cronStandardArray: CronStandardClass[];

    try {
      cronStandardArray = convertCronType(cronType);
    } catch (e) {
      return Promise.reject(
        new HttpResponse(HttpStatus.PRECONDITION_FAILED, e.message),
      );
    }

    for (let index = 0; index < cronStandardArray.length; index++) {
      // Need a for loop because Async/Wait does not work in ForEach

      const cron = cronStandardArray[index];

      // USELESS
      /*
      const whichGit: GitTypeEnum = RemoteConfigUtils.getGitType(
        cron.projectURL,
      );

      fileURL = RemoteConfigUtils.getGitRawPath(
        whichGit,
        cron.projectURL,
        `.hygie/${cron.filename}`,
      );

      // Check the cron-*.rulesrc file exist

      try {
        await this.httpService
          .head(fileURL)
          .toPromise()
          .catch(err => {
            throw err;
          });
      } catch (e) {
        return Promise.reject(
          new HttpResponse(
            HttpStatus.NOT_FOUND,
            `${responseString}\n${cron.filename} does not exist.`,
          ),
        );
      }*/

      try {
        schedule = await this.createSchedule(cron);
        responseString += `Schedule ${schedule.id} successfully created\n`;
      } catch (e) {
        return Promise.reject(
          new HttpResponse(
            HttpStatus.UNAUTHORIZED,
            `${responseString}\n${e.message}`,
          ),
        );
      }
    }
    return Promise.resolve(new HttpResponse(HttpStatus.OK, responseString));
  }
}
