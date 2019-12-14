import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
  Logger,
  Inject,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { ProcessEnvService } from '~common/providers/processEnv.service';
import { WhiteListCheckerI } from './whiteListChecker.interface';

@Injectable()
export class WhiteListInterceptor implements NestInterceptor {
  constructor(
    private readonly processEnvService: ProcessEnvService,
    @Inject('WhiteListChecker')
    private readonly whiteListChecker: WhiteListCheckerI,
  ) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (this.processEnvService.get('ENABLE_WHITELIST') !== 'true') {
      Logger.log('The WhiteListInterceptor is deactivated.');
      return next.handle();
    } else {
      Logger.log('The WhiteListInterceptor is activated.');
    }

    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    try {
      const isAccepted = this.whiteListChecker.isAccepted(request);

      if (!isAccepted) {
        response.status(HttpStatus.UNAUTHORIZED).send('Beta access required.');
        return of([]);
      } else {
        return next.handle();
      }
    } catch (e) {
      Logger.error(e, 'WhiteListInterceptor');
      return of([]);
    }
  }
}
