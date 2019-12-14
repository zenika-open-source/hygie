import { Controller, Body, Post, Res } from '@nestjs/common';
import { ScheduleService } from '../scheduler/scheduler.service';
import { CronType } from '../scheduler/cron.interface';
import { DataAccessService } from '../data_access/dataAccess.service';
import { HttpResponse } from '../utils/httpResponse';
import { LoggerService } from '../common/providers/logger/logger.service';

@Controller('cron')
export class CronController {
  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly dataAccessService: DataAccessService,
    private readonly loggerService: LoggerService,
  ) {
    this.loadCronJobs().catch(err =>
      this.loggerService.error(err, { location: 'CronController' }),
    );
  }

  /**
   * Reload all Cron Jobs when application restart
   */
  private async loadCronJobs(): Promise<void> {
    const CronStandardClassArray: CronType = await this.dataAccessService.getAllCrons();
    if (this.dataAccessService.removeAllCrons()) {
      this.scheduleService.createCronJobs(CronStandardClassArray).catch(err =>
        this.loggerService.error(err, {
          location: 'CronController',
        }),
      );
    } else {
      this.loggerService.error('Can not remove old cron jobs', {
        location: 'CronController',
      });
    }
  }

  /**
   * Should be remove in the near futur
   * Registration of cron job is now handle by the /webhook endpoint
   */
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
