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

  static writeFileSync(fileName: string, fileContent: string): boolean {
    const fs = require('fs');
    const path = require('path');
    fs.promises.mkdir(path.dirname(fileName), { recursive: true }).then(x =>
      fs.writeFileSync(fileName, fileContent, err => {
        if (err) {
          throw err;
        }
      }),
    );
    return true;
  }
}
