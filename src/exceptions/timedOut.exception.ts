import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Send a specific `HttpException` on etimedout
 */
export class TimedOutException extends HttpException {
  constructor() {
    super('Timed Out', HttpStatus.REQUEST_TIMEOUT);
  }
}
