import { Injectable, HttpService } from '@nestjs/common';
import { NestSchedule } from '@dxdeveloperexperience/nest-schedule';
import { Schedule } from './schedule';
import { CronStandardClass } from './cron.interface';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { RulesService } from '../rules/rules.service';
import { SchedulerException } from '../exceptions/scheduler.exception';
import { checkCronExpression } from './utils';
import { CronExpressionException } from '../exceptions/cronExpression.exception';

@Injectable()
export class ScheduleService {
  schedules: NestSchedule[] = new Array<NestSchedule>();
  readonly MAX_SCHEDULES: number = 3;

  constructor(
    private readonly githubService: GithubService,
    private readonly gitlabService: GitlabService,
    private readonly rulesService: RulesService,
    private readonly httpService: HttpService,
  ) {}

  /**
   * Create a new Schedule and add it to the list if `MAX_SCHEDULES` is not reached
   */
  createSchedule(cron: CronStandardClass, remoteRepository: string): Schedule {
    if (this.schedules.length < this.MAX_SCHEDULES) {
      if (
        typeof cron.expression !== 'undefined' &&
        !checkCronExpression(cron.expression)
      ) {
        throw new CronExpressionException(
          'Incorrect Cron Expression! You can not generate more than 1 cron job per hour.',
        );
      }

      const newSchedule = new Schedule(
        this.githubService,
        this.gitlabService,
        this.rulesService,
        this.httpService,
        cron,
        remoteRepository,
      );

      const expression: string = !!cron.expression
        ? cron.expression
        : '0 0 6-20/1 * * *';
      newSchedule.updateCron(expression);
      this.addSchedule(newSchedule);
      return newSchedule;
    } else {
      throw new SchedulerException('MAX_SCHEDULES reached!');
    }
  }

  addSchedule(schedule: NestSchedule): void {
    this.schedules.push(schedule);
  }
}
