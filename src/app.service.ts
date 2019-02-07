import { Injectable } from '@nestjs/common';
import { MyLogger } from './my-logger/my-logger.service';

@Injectable()
export class AppService {
  getHello(): string {
    MyLogger.log('Hello World test.');
    return 'Hello World!';
  }
}
