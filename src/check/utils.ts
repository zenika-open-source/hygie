import { existsSync } from 'fs-extra';
import { HttpService, Logger } from '@nestjs/common';

export class Check {
  /**
   * Check if the given file exit.
   * If not, a _warn_ message is logged.
   * @param filename
   * Relative path
   */
  static checkIfFileExist(filename: string): boolean {
    if (!existsSync(filename)) {
      Logger.error(
        `${filename} do not exist! Please refer to the documentation: https://zenika-open-source.github.io/hygie/`,
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

  static async checkInternet(httpService: HttpService): Promise<boolean> {
    return httpService
      .get('https://google.com')
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }
}
