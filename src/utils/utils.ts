import { HttpService } from '@nestjs/common';
import { logger } from '../logger/logger.service';

export class Utils {
  static getObjectValue(obj: object): object {
    return typeof obj === 'undefined' ? {} : obj;
  }

  static getStringValue(str: string): string {
    return typeof str === 'undefined' ? '' : str;
  }

  static loadEnv(filePath: string) {
    const fs = require('fs');
    const dotenv = require('dotenv');
    const envConfig = dotenv.parse(fs.readFileSync(filePath));
    // tslint:disable-next-line:forin
    for (const k in envConfig) {
      process.env[k] = envConfig[k];
    }
  }

  static downloadRemoteFile(
    httpService: HttpService,
    url: string,
    filePath: string,
  ): boolean {
    const fs = require('fs');
    httpService.get(url).subscribe(
      response => {
        //
      },
      err => {
        logger.error(err);
        return false;
      },
    );
    return true;
  }
}
