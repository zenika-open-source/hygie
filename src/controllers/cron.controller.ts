import {
  Controller,
  Body,
  Post,
  Res,
  HttpStatus,
  HttpService,
} from '@nestjs/common';
import { RemoteConfigUtils } from '../remote-config/utils';
import { ScheduleService } from '../scheduler/scheduler.service';
import {
  CronType,
  CronStandardClass,
  convertCronType,
} from '../scheduler/cron.interface';
import { Schedule } from '../scheduler/schedule';
import { DataAccessService } from '../data_access/dataAccess.service';
import { logger } from '../logger/logger.service';

@Controller('cron')
export class CronController {
  constructor(
    private readonly httpService: HttpService,
    private readonly scheduleService: ScheduleService,
    private readonly dataAccessService: DataAccessService,
  ) {
    this.loadCronJobs();
  }

  /**
   * Reload all Cron Jobs when application restart
   */
  private async loadCronJobs(): Promise<any> {
    const CronStandardClassArray: CronType = await this.dataAccessService.getAllCrons();
    if (this.dataAccessService.removeAllCrons()) {
      this.cronJobs(CronStandardClassArray);
    } else {
      logger.error('Can not remove old cron jobs');
    }
  }

  @Post('/')
  async cronJobs(@Body() cronType: CronType, @Res() response?): Promise<void> {
    let remoteRepository: string;
    let responseString: string = '';
    let schedule: Schedule;
    let cronStandardArray: CronStandardClass[];

    try {
      cronStandardArray = convertCronType(cronType);
    } catch (e) {
      if (typeof response !== 'undefined') {
        response.status(HttpStatus.PRECONDITION_FAILED).send(e.message);
      }
      return;
    }

    for (let index = 0; index < cronStandardArray.length; index++) {
      // Need a for loop because Async/Wait does not work in ForEach

      const cron = cronStandardArray[index];

      // First, download the cron-*.rulesrcs file
      try {
        remoteRepository = await RemoteConfigUtils.downloadRulesFile(
          this.dataAccessService,
          this.httpService,
          cron.projectURL,
          cron.filename,
        ).catch(e => {
          throw e;
        });
      } catch (e) {
        if (typeof response !== 'undefined') {
          response
            .status(HttpStatus.NOT_FOUND)
            .send(`${responseString}\n${e.message}`);
        }
        return;
      }

      try {
        schedule = this.scheduleService.createSchedule(cron, remoteRepository);
        responseString += `Schedule ${schedule.id} successfully created\n`;
      } catch (e) {
        if (typeof response !== 'undefined') {
          response
            .status(HttpStatus.UNAUTHORIZED)
            .send(`${responseString}\n${e.message}`);
        }
        return;
      }
    }
    if (typeof response !== 'undefined') {
      response.status(HttpStatus.OK).send(responseString);
    }
  }
}
