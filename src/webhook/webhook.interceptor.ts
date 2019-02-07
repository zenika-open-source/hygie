import { Injectable, NestInterceptor, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Webhook } from './webhook';
import { GitTypeEnum } from './utils.enum';
import { map, takeLast } from 'rxjs/operators';

@Injectable()
export class WebhookInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    call$: Observable<any>,
  ): Observable<any> {
    return call$;
  }
}
