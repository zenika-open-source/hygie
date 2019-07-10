import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { Webhook } from '../webhook/webhook';
import { GitEventEnum } from '../webhook/utils.enum';

@Injectable()
export class EnvVarInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    const incomingWebhook: Webhook = request.body;

    if (
      incomingWebhook.gitEvent === GitEventEnum.Push &&
      incomingWebhook.getBranchName() === incomingWebhook.getDefaultBranchName()
    ) {
      return next.handle();
    } else {
      return of([]);
    }
  }
}
