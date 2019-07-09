import { Runnable } from './runnable.class';
import { logger } from '../logger/logger.service';
import { RuleResult } from '../rules/ruleResult';
import { render } from 'mustache';
import { CallbackType } from './runnables.service';
import { RunnableDecorator } from './runnable.decorator';
import { Inject } from '@nestjs/common';
import { Visitor } from 'universal-analytics';
import { EnvVarAccessor } from '../env-var/env-var.accessor';

interface LoggerArgs {
  type: string;
  message: string;
}

/**
 * `LoggerRunnable` logs informations in your terminal.
 */
@RunnableDecorator('LoggerRunnable')
export class LoggerRunnable extends Runnable {
  constructor(
    @Inject('GoogleAnalytics')
    private readonly googleAnalytics: Visitor,
    private readonly envVarAccessor: EnvVarAccessor,
  ) {
    super();
  }

  async run(
    callbackType: CallbackType,
    ruleResult: RuleResult,
    args: LoggerArgs,
  ): Promise<void> {
    ruleResult.env = this.envVarAccessor.getAllEnvVar();

    this.googleAnalytics
      .event('Runnable', 'logger', ruleResult.projectURL)
      .send();

    // Defaults
    if (
      typeof args.type === 'undefined' &&
      callbackType === CallbackType.Error
    ) {
      args.type = 'error';
    } else if (typeof args.type === 'undefined') {
      args.type = 'info';
    }

    switch (args.type) {
      case 'info':
        logger.info(render(args.message, ruleResult));
        break;
      case 'warn':
        logger.warn(render(args.message, ruleResult));
        break;
      case 'error':
        logger.error(render(args.message, ruleResult));
        break;
    }
  }
}
