import { Runnable } from './runnable.class';
import { RuleResult } from '../rules/ruleResult';
import { render } from 'mustache';
import { CallbackType } from './runnables.service';
import { RunnableDecorator } from './runnable.decorator';
import { Inject } from '@nestjs/common';
import { Visitor } from 'universal-analytics';
import { ScheduleService } from '../scheduler/scheduler.service';
import { DataAccessService } from '../data_access/dataAccess.service';

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
    private readonly schedulerServie: ScheduleService,
    private readonly dataAccessService: DataAccessService,
    @Inject('GoogleAnalytics')
    private readonly googleAnalytics: Visitor,
  ) {
    super();
  }

  async run(
    callbackType: CallbackType,
    ruleResult: RuleResult,
    args: UpdateCronArgs,
  ): Promise<void> {
    const { added, updated, removed } = ruleResult.data as any;

    this.googleAnalytics
      .event('Runnable', 'UpdateCron', ruleResult.projectURL)
      .send();
  }
}
