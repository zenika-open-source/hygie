import { Controller, Body, Post, Res } from '@nestjs/common';
import { ScheduleService } from '../scheduler/scheduler.service';
import { CronType } from '../scheduler/cron.interface';
import { DataAccessService } from '../data_access/dataAccess.service';
import { logger } from '../logger/logger.service';
import { HttpResponse } from '../utils/httpResponse';

@Controller('cron')
export class CronController {
  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly dataAccessService: DataAccessService,
  ) {
    this.loadCronJobs().catch(err => logger.error(err));
  }

  /**
   * Reload all Cron Jobs when application restart
   */
  private async loadCronJobs(): Promise<void> {
    const CronStandardClassArray: CronType = await this.dataAccessService.getAllCrons();
    if (this.dataAccessService.removeAllCrons()) {
      this.scheduleService
        .createCronJobs(CronStandardClassArray)
        .catch(err => logger.error(err));
    } else {
      logger.error('Can not remove old cron jobs', {
        location: 'CronController',
      });
    }
  }

  @Post('/')
  async cronJobs(@Body() cronType: CronType, @Res() response): Promise<void> {
    const httpResponse: HttpResponse = await this.scheduleService
      .createCronJobs(cronType)
      .catch(err => {
        return err;
      });

    response.status(httpResponse.status).send(httpResponse.message);
  }
}
