import { Injectable } from '@nestjs/common';
import { Cron, NestSchedule } from '@dxdeveloperexperience/nest-schedule';
import { logger } from '../logger/logger.service';
import { Utils } from '../utils/utils';

export interface ScheduleInformations {
  message: string;
  cron: string;
}

@Injectable()
export class Schedule extends NestSchedule {
  readonly id: string;
  readonly name: string;

  readonly informations: ScheduleInformations;

  constructor(name: string, infos: ScheduleInformations) {
    super();
    this.id = Utils.generateUniqueId();
    this.name = name;
    logger.info('Schedule :' + name);
    this.informations = infos;
  }

  @Cron('*/5 * * * * *', {
    startTime: new Date(),
    endTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    tz: 'Europe/Paris',
  })
  async cronJob() {
    logger.info(`${this.id} ${this.name} : ${this.informations.message}`);
  }
}
