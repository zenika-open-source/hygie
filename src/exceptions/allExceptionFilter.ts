import {
  ExceptionFilter,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Utils } from '../utils/utils';

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
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (status === HttpStatus.NOT_FOUND) {
      return response
        .status(status)
        .send(Utils.renderHbs('404', { path: request.url }));
    }

    return response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
