import { existsSync } from 'fs-extra';
import { logger } from '../logger/logger.service';
import { HttpService } from '@nestjs/common';

export class Check {
  /**
   * Check if the given file exit.
   * If not, a _warn_ message is logged.
   * @param filename
   * Relative path
   */
  static checkIfFileExist(filename: string): boolean {
    if (!existsSync(filename)) {
      logger.error(
        `${filename} do not exist! Please refer to the documentation: https://dx-developerexperience.github.io/git-webhooks/`,
      );
      return false;
    }
    return true;
  }

  /**
   * Check if the given needed files exist.
   * @param filenames
   * Array of relative paths
   */
  static checkNeededFiles(filenames: string[]): boolean {
    let allFilesOk: boolean = true;
    filenames.forEach(f => {
      if (!this.checkIfFileExist(f)) {
        allFilesOk = false;
      }
    });
    return allFilesOk;
  }

  static async checkInternet(httpService: HttpService) {
    return new Promise((resolve, reject) => {
      httpService
        .get('https://google.com')
        .toPromise()
        .then(() => {
          resolve(true);
        })
        .catch(() => {
          resolve(false);
        });
    });
  }
}
