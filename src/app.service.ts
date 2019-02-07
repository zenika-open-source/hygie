import { Injectable } from '@nestjs/common';
import { logger } from './logger/logger.service';

@Injectable()
export class AppService {
  getHello(): string {
    logger.debug('This is app service');
    return 'Hello World!';
  }
}
