import { HttpStatus } from '@nestjs/common';

export class HttpResponse {
  status: HttpStatus;
  message: string;

  constructor(s: HttpStatus, m: string) {
    this.status = s;
    this.message = m;
  }
}
