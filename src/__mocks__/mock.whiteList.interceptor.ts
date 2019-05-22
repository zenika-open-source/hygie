import { of, Observable } from 'rxjs';
import { logger } from '../logger/logger.service';
import {
  ExecutionContext,
  CallHandler,
  NestInterceptor,
  HttpStatus,
} from '@nestjs/common';

export class MockWhiteListInterceptorNext implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle();
  }
}

export class MockWhiteListInterceptorBlock implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();
    response.status(HttpStatus.UNAUTHORIZED).send('Beta access required.');
    return of([]);
  }
}
