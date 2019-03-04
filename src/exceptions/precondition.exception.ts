import { HttpException, HttpStatus } from '@nestjs/common';

export class PreconditionException extends HttpException {
  constructor() {
    super('Precondition Failed', HttpStatus.PRECONDITION_FAILED);
  }
}
