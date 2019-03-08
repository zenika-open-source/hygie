import { ExceptionFilter, Catch } from '@nestjs/common';

/**
 * Handle all ExceptionFilter
 * Return `statusCode`, `timestamp` and `path` as `http response`
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception, host) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();

    const res = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(res);
  }
}
