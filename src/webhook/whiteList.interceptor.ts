import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { logger } from '../logger/logger.service';

@Injectable()
export class WhiteListInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const CryptoJS = require('crypto-js');
    const Compare = require('secure-compare');

    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const bodyRequest: any = request.body;

    try {
      let gitSignature: string;
      if (typeof request.headers['x-hub-signature'] !== 'undefined') {
        gitSignature = request.headers['x-hub-signature'];
      } else if (
        request.headers['x-gitlab-token'] === process.env.WEBHOOK_SECRET
      ) {
        return next.handle();
      } else {
        response.status(HttpStatus.UNAUTHORIZED).send('Secret token required.');
        return of([]);
      }

      const signature: string =
        'sha1=' +
        CryptoJS.HmacSHA1(
          JSON.stringify(bodyRequest),
          process.env.WEBHOOK_SECRET,
        ).toString();

      if (Compare(signature, gitSignature)) {
        return next.handle();
      } else {
        response.status(HttpStatus.UNAUTHORIZED).send('Beta access required.');
        return of([]);
      }
    } catch (e) {
      logger.error(e, {
        location: 'WhiteListInterceptor',
      });
      return of([]);
    }
  }
}
