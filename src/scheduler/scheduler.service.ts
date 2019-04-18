import { Injectable } from '@nestjs/common';
import { NestSchedule } from '@dxdeveloperexperience/nest-schedule';
import { Schedule } from './schedule';
import { CronInterface } from './cron.interface';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { RulesService } from '../rules/rules.service';

@Injectable()
export class ScheduleService {
  schedules: NestSchedule[] = new Array<NestSchedule>();
  readonly MAX_SCHEDULES: number = 3;

  constructor(
    private readonly githubService: GithubService,
    private readonly gitlabService: GitlabService,
    private readonly rulesService: RulesService,
  ) {}

  /**
   * Create a new Schedule and add it to the list if `MAX_SCHEDULES` is not reached
   */
  createSchedule(cron: CronInterface, remoteRepository: string): boolean {
    if (this.schedules.length < this.MAX_SCHEDULES) {
      const newSchedule = new Schedule(
        this.githubService,
        this.gitlabService,
        this.rulesService,
        cron,
        remoteRepository,
      );

      const expression: string = !!cron.expression
        ? cron.expression
        : '*/2 * * * * *';
      newSchedule.updateCron(expression);
      this.addSchedule(newSchedule);
      return true;
    }
    return false;
  }

  addSchedule(schedule: NestSchedule): void {
    this.schedules.push(schedule);
  }
}
