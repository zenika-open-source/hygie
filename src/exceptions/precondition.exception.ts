import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Send a specific `HttpException` when preconditions fail
 */
export class PreconditionException extends HttpException {
  constructor() {
    super('Precondition Failed', HttpStatus.PRECONDITION_FAILED);
  }
}
