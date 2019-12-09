import { Injectable, Logger as NestLogger } from '@nestjs/common';
import { ProcessEnvService } from '../processEnv.service';

interface Context {
  [key: string]: string;
}

@Injectable()
export class LoggerService {
  constructor(
    private nestLogger: NestLogger,
    private processEnvService: ProcessEnvService,
  ) {}

  private buildMessage(message: string, context: Context): string {
    const IS_VERBOSE_LOGGER =
      this.processEnvService.get('VERBOSE_LOGGER') === 'true';

    let finalMessage = '';
    if (IS_VERBOSE_LOGGER && context.project !== undefined) {
      finalMessage += `[${context.project}]`;
    }
    if (IS_VERBOSE_LOGGER && context.location !== undefined) {
      finalMessage += `[${context.location}]`;
    }
    if (finalMessage !== '') {
      finalMessage += ': ';
    }
    finalMessage += message;

    return finalMessage;
  }

  error(message: string, context: Context) {
    this.nestLogger.error(this.buildMessage(message, context));
  }

  log(message: string, context: Context) {
    this.nestLogger.log(this.buildMessage(message, context));
  }

  warn(message: string, context: Context) {
    this.nestLogger.warn(this.buildMessage(message, context));
  }

  debug(message: string, context: Context) {
    this.nestLogger.debug(this.buildMessage(message, context));
  }

  verbose(message: string, context: Context) {
    this.nestLogger.verbose(this.buildMessage(message, context));
  }
}
