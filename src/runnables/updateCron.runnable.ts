import { Runnable } from './runnable.class';
import { RuleResult } from '../rules/ruleResult';
import { CallbackType } from './runnables.service';
import { RunnableDecorator } from './runnable.decorator';
import { Inject } from '@nestjs/common';
import { Visitor } from 'universal-analytics';
import { CronInterface } from '../scheduler/cron.interface';
import { logger } from '../logger/logger.service';
import { Utils } from '../utils/utils';

interface UpdateCronArgs {
  arg: any;
}

/**
 * `UpdateCronRunnable` add/update/remove all cron files returned by `checkCronFiles` rule.
 * @warning need to be the `onSuccess` callback of `checkCronFiles` rule.
 */
@RunnableDecorator('UpdateCronRunnable')
export class UpdateCronRunnable extends Runnable {
  constructor(
    // private readonly scheduleServie: ScheduleService,
    // private readonly dataAccessService: DataAccessService,
    @Inject('GoogleAnalytics')
    private readonly googleAnalytics: Visitor,
  ) {
    super();
  }

  getCronFileName(str: string): string {
    return str.replace('.hygie/', '');
  }

  async run(
    callbackType: CallbackType,
    ruleResult: RuleResult,
    args: UpdateCronArgs,
  ): Promise<void> {
    this.googleAnalytics
      .event('Runnable', 'UpdateCron', ruleResult.projectURL)
      .send();

    const { added, updated, removed } = (ruleResult.data as any).cron;

    const addOrUpdate: string[] = added.concat(updated);

    if (addOrUpdate.length > 0) {
      //
      const addOrUpdateCrons: CronInterface[] = addOrUpdate.map(a => {
        return {
          filename: this.getCronFileName(a),
          projectURL: ruleResult.projectURL,
        };
      });
      // tslint:disable-next-line:no-console
      // console.log(addOrUpdateCrons);
      // this.scheduleServie.createCronJobs(addedCrons);
    }

    if (typeof removed !== 'undefined' && removed.length > 0) {
      //
      removed.map(r => {
        const filename: string = this.getCronFileName(r);
        const cron: string = `${Utils.getRepositoryFullName(
          ruleResult.projectURL,
        )}/${filename}`;
        // logger.info('Removing ' + cron);
        // this.dataAccessService.deleteCron(cron);
      });
    }
  }
}
