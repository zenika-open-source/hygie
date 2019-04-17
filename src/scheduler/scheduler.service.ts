import { Injectable } from '@nestjs/common';
import { NestSchedule } from '@dxdeveloperexperience/nest-schedule';
import { Schedule, ScheduleInformations } from './schedule';

@Injectable()
export class ScheduleService {
  schedules: NestSchedule[] = new Array<NestSchedule>();
  readonly MAX_SCHEDULES: number = 3;

  /**
   * Create a new Schedule and add it to the list if `MAX_SCHEDULES` is not reached
   */
  createSchedule(name: string, infos: ScheduleInformations): boolean {
    if (this.schedules.length < this.MAX_SCHEDULES) {
      const newSchedule = new Schedule(name, infos);
      newSchedule.updateCron(infos.cron);
      this.addSchedule(newSchedule);
      return true;
    }
    return false;
  }

  addSchedule(schedule: NestSchedule): void {
    this.schedules.push(schedule);
  }
}
