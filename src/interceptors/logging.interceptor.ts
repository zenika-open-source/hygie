import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrometheusService } from '../logger/prometheus.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly prometheus: PrometheusService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const responseTimeInMs = Date.now() - now;
        const routePath = request.url;
        const responseCode = response.statusCode;
        const method = request.method;

        if (routePath !== '/metrics') {
          this.prometheus.httpRequestDurationMicroseconds
            .labels(method, routePath, responseCode)
            .observe(responseTimeInMs);
        }
      }),
    );
  }
}
